import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const APP_URL = "https://carter-connect.vercel.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { candidateName, candidateEmail, approved } = await req.json();

  const subject = approved
    ? "Votre profil a été approuvé — Logan"
    : "Mise à jour de votre candidature — Logan";

  const FONT = `<html><head><link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,300;6..96,400&display=swap" rel="stylesheet"></head>`;

  const html = approved
    ? FONT + `
      <div style="background:#0a0a0a;padding:48px 0;font-family:sans-serif;">
        <div style="max-width:520px;margin:0 auto;background:#111;border:1px solid #222;border-radius:2px;overflow:hidden;">
          <div style="padding:40px 48px 32px;border-bottom:1px solid #1e1e1e;text-align:center;">
            <p style="font-family:'Bodoni Moda','Georgia',serif;font-size:36px;font-weight:300;color:#fff;margin:0;letter-spacing:0.06em;">Logan</p>
            <p style="font-size:10px;color:#555;letter-spacing:0.18em;text-transform:uppercase;margin:8px 0 0;font-family:sans-serif;">Réseau confidentiel d'avocats d'affaires</p>
          </div>
          <div style="padding:40px 48px;">
            <h2 style="font-family:'Bodoni Moda','Georgia',serif;font-size:22px;font-weight:300;color:#fff;margin:0 0 16px;line-height:1.4;">Profil approuvé</h2>
            <p style="font-size:14px;color:#999;line-height:1.7;margin:0 0 8px;font-family:sans-serif;font-weight:300;">
              Bonjour ${candidateName},
            </p>
            <p style="font-size:14px;color:#999;line-height:1.7;margin:0 0 32px;font-family:sans-serif;font-weight:300;">
              Votre profil a été <strong style="color:#fff;">approuvé</strong> par l'équipe Logan. Vous pouvez dès maintenant accéder à votre espace candidat et découvrir les opportunités disponibles.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${APP_URL}/espace-candidat" style="display:inline-block;background:#fff;color:#000;text-decoration:none;padding:14px 36px;font-family:sans-serif;font-size:12px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;border-radius:1px;">
                Accéder à mon espace
              </a>
            </div>
            <p style="font-size:12px;color:#555;line-height:1.6;margin:24px 0 0;font-family:sans-serif;font-weight:300;">
              Bienvenue dans le réseau Logan.
            </p>
          </div>
          <div style="padding:24px 48px;border-top:1px solid #1e1e1e;text-align:center;">
            <p style="font-size:11px;color:#444;margin:0;font-family:sans-serif;letter-spacing:0.06em;">— L'équipe Logan · loganexecutive.com</p>
          </div>
        </div>
      </div>
    `
    : FONT + `
      <div style="background:#0a0a0a;padding:48px 0;font-family:sans-serif;">
        <div style="max-width:520px;margin:0 auto;background:#111;border:1px solid #222;border-radius:2px;overflow:hidden;">
          <div style="padding:40px 48px 32px;border-bottom:1px solid #1e1e1e;text-align:center;">
            <p style="font-family:'Bodoni Moda','Georgia',serif;font-size:36px;font-weight:300;color:#fff;margin:0;letter-spacing:0.06em;">Logan</p>
            <p style="font-size:10px;color:#555;letter-spacing:0.18em;text-transform:uppercase;margin:8px 0 0;font-family:sans-serif;">Réseau confidentiel d'avocats d'affaires</p>
          </div>
          <div style="padding:40px 48px;">
            <h2 style="font-family:'Bodoni Moda','Georgia',serif;font-size:22px;font-weight:300;color:#fff;margin:0 0 16px;line-height:1.4;">Mise à jour de votre candidature</h2>
            <p style="font-size:14px;color:#999;line-height:1.7;margin:0 0 8px;font-family:sans-serif;font-weight:300;">Bonjour ${candidateName},</p>
            <p style="font-size:14px;color:#999;line-height:1.7;margin:0 0 32px;font-family:sans-serif;font-weight:300;">
              Après examen attentif de votre profil, nous ne sommes pas en mesure de donner suite à votre candidature pour le moment. Nous conservons vos informations et reviendrons vers vous si une opportunité correspondante se présente.
            </p>
          </div>
          <div style="padding:24px 48px;border-top:1px solid #1e1e1e;text-align:center;">
            <p style="font-size:11px;color:#444;margin:0;font-family:sans-serif;letter-spacing:0.06em;">— L'équipe Logan · loganexecutive.com</p>
          </div>
        </div>
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
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
