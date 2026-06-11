import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const APP_URL = "https://loganexecutive.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { candidateName, candidateEmail, approved } = await req.json();

  if (!approved) {
    return new Response(JSON.stringify({ skipped: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const html = `
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400&family=DM+Sans:wght@300;400&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'DM Sans',sans-serif;">
  <div style="max-width:520px;padding:48px 32px;">

    <p style="font-family:'Cormorant',Georgia,serif;font-size:36px;font-weight:300;letter-spacing:0.06em;color:#0a0a0a;margin:0 0 4px;">Logan</p>
    <p style="font-family:'DM Sans',sans-serif;font-size:9px;font-weight:400;letter-spacing:0.28em;text-transform:uppercase;color:#999;margin:0 0 48px;">Réseau confidentiel d'avocats d'affaires</p>

    <h1 style="font-family:'Cormorant',Georgia,serif;font-size:26px;font-weight:400;color:#0a0a0a;margin:0 0 20px;letter-spacing:0.01em;">Votre accès est activé.</h1>

    <p style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;line-height:1.8;color:#555;margin:0 0 8px;">
      Bonjour ${candidateName},
    </p>
    <p style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;line-height:1.8;color:#555;margin:0 0 32px;">
      Votre profil a été validé par l'équipe Logan. Vous pouvez dès maintenant vous connecter à votre espace candidat avec votre email et votre mot de passe.
    </p>

    <a href="${APP_URL}/connexion" style="display:inline-block;background:#0a0a0a;color:#ffffff;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;padding:14px 28px;">
      Accéder à mon espace →
    </a>

    <p style="font-family:'DM Sans',sans-serif;font-size:11px;color:#bbb;margin:40px 0 0;line-height:1.6;">
      Connectez-vous sur <a href="${APP_URL}/connexion" style="color:#bbb;">${APP_URL}/connexion</a> avec l'email et le mot de passe choisis lors de votre inscription.
    </p>

    <p style="font-family:'DM Sans',sans-serif;font-size:11px;color:#bbb;margin:24px 0 0;">
      — L'équipe Logan · <a href="mailto:contact@loganexecutive.com" style="color:#bbb;">contact@loganexecutive.com</a>
    </p>

  </div>
</body>
</html>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Logan <noreply@loganexecutive.com>",
      to: candidateEmail,
      subject: "Votre accès Logan est activé",
      html,
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
