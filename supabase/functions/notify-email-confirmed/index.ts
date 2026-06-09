import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "simonallal.executive@gmail.com";
const APP_URL = "https://carter-connect.vercel.app";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
  const payload = await req.json();
  const record = payload.record;
  const oldRecord = payload.old_record;

  // Se déclenche uniquement quand email_confirmed_at passe de null à une valeur
  if (!record?.email_confirmed_at || oldRecord?.email_confirmed_at) {
    return new Response(JSON.stringify({ skipped: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const userId = record.id;
  const candidateEmail = record.email;
  const meta = record.raw_user_meta_data || {};
  const candidateName = `${meta.prenom || ""} ${meta.nom || ""}`.trim() || meta.full_name || candidateEmail;

  // Passe le statut à pending_admin_approval pour que l'admin puisse valider
  await supabaseAdmin
    .from("candidate_registrations")
    .update({ status: "pending_admin_approval" })
    .eq("user_id", userId)
    .eq("status", "pending_email_verification");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Logan <noreply@loganexecutive.com>",
      to: ADMIN_EMAIL,
      subject: `Candidat à valider — ${candidateName}`,
      html: `
        <html><head><link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,300;6..96,400&display=swap" rel="stylesheet"></head>
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
          <p style="font-family:'Bodoni Moda','Georgia',serif;font-size:32px;font-weight:300;margin:0 0 24px;letter-spacing:0.06em;">Logan</p>
          <h2 style="font-family:'Bodoni Moda','Georgia',serif;font-weight:400;font-size:20px;margin:0 0 16px;">Nouveau profil à valider</h2>
          <p><strong>Nom :</strong> ${candidateName}</p>
          <p><strong>Email :</strong> ${candidateEmail}</p>
          <p style="margin-top:8px;">Le candidat a confirmé son adresse email. Son profil est en attente de votre validation.</p>
          <a href="${APP_URL}/admin/profils" style="display:inline-block;margin-top:24px;padding:14px 28px;background:#000;color:#fff;text-decoration:none;font-family:sans-serif;font-size:13px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;">
            Valider le profil →
          </a>
          <p style="color:#999;font-size:12px;margin-top:24px;font-family:sans-serif;">— L'équipe Logan</p>
        </div>
      `,
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
