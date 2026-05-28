import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const APP_URL = Deno.env.get("APP_URL") ?? "http://localhost:8080";

serve(async (req) => {
  const { candidateName, candidateEmail, approved } = await req.json();

  const subject = approved
    ? "Votre profil a été validé — Logan"
    : "Mise à jour de votre candidature — Logan";

  const html = approved
    ? `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="font-weight: 400;">Bonjour ${candidateName},</h2>
        <p>Bonne nouvelle ! Votre profil a été <strong>validé</strong> par l'équipe Logan.</p>
        <p>Vous pouvez dès maintenant accéder à votre espace candidat.</p>
        <a href="${APP_URL}/auth" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:4px;">
          Accéder à mon espace
        </a>
        <p style="color: #666; font-size: 14px; margin-top: 24px;">— L'équipe Logan</p>
      </div>
    `
    : `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="font-weight: 400;">Bonjour ${candidateName},</h2>
        <p>Après examen de votre profil, nous ne sommes pas en mesure de donner suite à votre candidature pour le moment.</p>
        <p>Nous conservons votre profil et reviendrons vers vous si une opportunité correspondante se présente.</p>
        <p style="color: #666; font-size: 14px;">— L'équipe Logan</p>
      </div>
    `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Logan <noreply@loganexecutive.com>",
      to: candidateEmail,
      subject,
      html,
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
