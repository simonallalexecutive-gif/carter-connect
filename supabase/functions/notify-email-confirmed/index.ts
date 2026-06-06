import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "simonallal.executive@gmail.com";
const APP_URL = "https://carter-connect.vercel.app";

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

  const candidateEmail = record.email;
  const meta = record.raw_user_meta_data || {};
  const candidateName = `${meta.prenom || ""} ${meta.nom || ""}`.trim() || meta.full_name || candidateEmail;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Logan <noreply@loganexecutive.com>",
      to: ADMIN_EMAIL,
      subject: `Candidat à valider — ${candidateName}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
          <p style="font-family:'Georgia',serif;font-size:28px;font-weight:300;margin:0 0 24px;letter-spacing:0.04em;">Logan</p>
          <h2 style="font-weight:400;font-size:18px;margin:0 0 16px;">Nouveau profil à valider</h2>
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
