import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "simonallal.executive@gmail.com";
const APP_URL = "https://loganexecutive.com";

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
  const userEmail = record.email;
  const meta = record.raw_user_meta_data || {};
  const userType = meta.user_type || "candidat";

  // ── CAS CABINET ──────────────────────────────────────────────────────────────
  if (userType === "cabinet") {
    // Récupérer les données du cabinet
    const { data: cab } = await supabaseAdmin
      .from("cabinet_accounts")
      .select("cabinet_name, contacts, palier")
      .eq("user_id", userId)
      .maybeSingle();

    const contact = Array.isArray(cab?.contacts) ? cab.contacts[0] : null;
    const prenom   = contact?.prenom || meta.full_name?.split(" ")[0] || "";
    const nom      = contact?.nom    || meta.full_name?.split(" ").slice(1).join(" ") || "";
    const fullName = [prenom, nom].filter(Boolean).join(" ") || userEmail;
    const cabinet  = cab?.cabinet_name || meta.cabinet_name || "—";
    const statut   = contact?.role  || "—";
    const tel      = contact?.mobile || "—";

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Logan <noreply@loganexecutive.com>",
        to: ADMIN_EMAIL,
        subject: `Nouveau cabinet inscrit — ${cabinet} (${fullName})`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
            <p style="font-family:'Georgia',serif;font-size:32px;font-weight:300;margin:0 0 28px;letter-spacing:0.06em;">Logan</p>
            <h2 style="font-family:'Georgia',serif;font-weight:400;font-size:20px;margin:0 0 20px;">Nouveau cabinet inscrit</h2>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tr><td style="padding:8px 0;color:#666;width:140px;">Prénom</td><td style="padding:8px 0;font-weight:600;">${prenom}</td></tr>
              <tr style="border-top:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Nom</td><td style="padding:8px 0;font-weight:600;">${nom}</td></tr>
              <tr style="border-top:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Cabinet</td><td style="padding:8px 0;font-weight:600;">${cabinet}</td></tr>
              <tr style="border-top:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Statut</td><td style="padding:8px 0;">${statut}</td></tr>
              <tr style="border-top:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Téléphone</td><td style="padding:8px 0;">${tel}</td></tr>
              <tr style="border-top:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;">${userEmail}</td></tr>
            </table>
            <a href="${APP_URL}/admin/cabinets" style="display:inline-block;margin-top:28px;padding:14px 28px;background:#000;color:#fff;text-decoration:none;font-family:sans-serif;font-size:13px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;">
              Consulter le profil →
            </a>
            <p style="color:#999;font-size:12px;margin-top:24px;">— L'équipe Logan</p>
          </div>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true, type: "cabinet" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── CAS CANDIDAT ─────────────────────────────────────────────────────────────
  const candidateName = `${meta.prenom || ""} ${meta.nom || ""}`.trim() || meta.full_name || userEmail;

  // Passe le statut à pending_admin_approval
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
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
          <p style="font-family:'Georgia',serif;font-size:32px;font-weight:300;margin:0 0 28px;letter-spacing:0.06em;">Logan</p>
          <h2 style="font-family:'Georgia',serif;font-weight:400;font-size:20px;margin:0 0 20px;">Nouveau profil candidat à valider</h2>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr><td style="padding:8px 0;color:#666;width:140px;">Nom</td><td style="padding:8px 0;font-weight:600;">${candidateName}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;">${userEmail}</td></tr>
          </table>
          <p style="margin-top:16px;font-size:13px;color:#555;">Le candidat a confirmé son adresse email. Son profil est en attente de votre validation.</p>
          <a href="${APP_URL}/admin/profils" style="display:inline-block;margin-top:28px;padding:14px 28px;background:#000;color:#fff;text-decoration:none;font-family:sans-serif;font-size:13px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;">
            Valider le profil →
          </a>
          <p style="color:#999;font-size:12px;margin-top:24px;">— L'équipe Logan</p>
        </div>
      `,
    }),
  });

  return new Response(JSON.stringify({ success: true, type: "candidat" }), {
    headers: { "Content-Type": "application/json" },
  });
});
