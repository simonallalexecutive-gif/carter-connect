import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = "re_3H67YBCH_32oQyBvJNK4iY8G1nDTf3S8j";
const ADMIN_EMAIL = "simonallal.executive@gmail.com";
const APP_URL = Deno.env.get("APP_URL") ?? "https://loganexecutive.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let candidateName: string;
  let candidateEmail: string;
  let registrationId: string;

  try {
    const payload = await req.json();

    // Support database webhook format (record.xxx) and direct invocation format
    if (payload.record) {
      const r = payload.record;
      candidateName = `${r.prenom ?? ""} ${r.nom ?? ""}`.trim() || r.name || "Candidat";
      candidateEmail = r.email ?? "";
      registrationId = r.id ?? "";
    } else {
      candidateName = payload.candidateName ?? "";
      candidateEmail = payload.candidateEmail ?? "";
      registrationId = payload.registrationId ?? "";
    }
  } catch (err) {
    console.error("Failed to parse body:", err);
    return new Response(JSON.stringify({ error: "invalid body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!candidateEmail) {
    console.error("Missing candidateEmail");
    return new Response(JSON.stringify({ error: "missing candidateEmail" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const sendEmail = async (to: string, subject: string, html: string) => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: "Logan <noreply@loganexecutive.com>", to, subject, html }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`Resend error for ${to}:`, text);
    }
    return res.ok;
  };

  // Email au candidat
  await sendEmail(
    candidateEmail,
    "Votre profil a bien été soumis — Logan",
    `<div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="font-weight: 400;">Bonjour ${candidateName},</h2>
      <p>Votre profil a bien été reçu par l'équipe Logan.</p>
      <p>Nous l'examinerons sous <strong>48 heures ouvrées</strong> et vous recevrez une réponse par email.</p>
      <p style="color: #666; font-size: 14px;">— L'équipe Logan</p>
    </div>`,
  );

  // Email à l'admin
  await sendEmail(
    ADMIN_EMAIL,
    `Nouvelle inscription candidat — ${candidateName}`,
    `<div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="font-weight: 400;">Nouveau candidat inscrit</h2>
      <p><strong>Nom :</strong> ${candidateName}</p>
      <p><strong>Email :</strong> ${candidateEmail}</p>
      <p><strong>ID :</strong> ${registrationId}</p>
      <a href="${APP_URL}/admin/profils" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:4px;">
        Voir le profil dans l'admin
      </a>
    </div>`,
  );

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
