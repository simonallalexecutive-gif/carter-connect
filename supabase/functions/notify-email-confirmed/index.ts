import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "simonallal.executive@gmail.com";
const APP_URL = Deno.env.get("APP_URL") ?? "http://localhost:8080";

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
  const candidateName = record.raw_user_meta_data?.full_name || candidateEmail;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Logan <noreply@loganexecutive.com>",
      to: ADMIN_EMAIL,
      subject: `Nouveau candidat confirmé — ${candidateName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="font-weight: 400;">Nouveau candidat inscrit</h2>
          <p><strong>Nom :</strong> ${candidateName}</p>
          <p><strong>Email :</strong> ${candidateEmail}</p>
          <p>Le candidat a confirmé son adresse email. Vous pouvez consulter et valider son profil.</p>
          <a href="${APP_URL}/admin/profils" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:4px;">
            Voir le profil dans l'admin
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 24px;">— Logan</p>
        </div>
      `,
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
