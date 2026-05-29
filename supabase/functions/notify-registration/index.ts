import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "simonallal.executive@gmail.com";
const APP_URL = Deno.env.get("APP_URL") ?? "http://localhost:8080";

serve(async (req) => {
  const { candidateName, candidateEmail, registrationId } = await req.json();

  // Email au candidat
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Logan <noreply@loganexecutive.com>",
      to: candidateEmail,
      subject: "Votre profil a bien été soumis — Logan",
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="font-weight: 400;">Bonjour ${candidateName},</h2>
          <p>Votre profil a bien été reçu par l'équipe Logan.</p>
          <p>Nous l'examinerons sous <strong>48 heures ouvrées</strong> et vous recevrez une réponse par email.</p>
          <p style="color: #666; font-size: 14px;">— L'équipe Logan</p>
        </div>
      `,
    }),
  });

  // Email à l'admin
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Logan <noreply@loganexecutive.com>",
      to: ADMIN_EMAIL,
      subject: `Nouvelle inscription candidat — ${candidateName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="font-weight: 400;">Nouveau candidat inscrit</h2>
          <p><strong>Nom :</strong> ${candidateName}</p>
          <p><strong>Email :</strong> ${candidateEmail}</p>
          <p><strong>ID :</strong> ${registrationId}</p>
          <a href="${APP_URL}/admin/profils" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:4px;">
            Voir le profil dans l'admin
          </a>
        </div>
      `,
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
