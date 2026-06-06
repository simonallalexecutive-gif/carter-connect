import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "simonallal.executive@gmail.com";
const APP_URL = "https://carter-connect.vercel.app";

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
  let notaBene: string = "";
  let cabinet: string = "";
  let departement: string = "";

  try {
    const payload = await req.json();
    if (payload.record) {
      const r = payload.record;
      candidateName = `${r.prenom ?? ""} ${r.nom ?? ""}`.trim() || r.name || "Candidat";
      candidateEmail = r.email ?? "";
      registrationId = r.id ?? "";
    } else {
      candidateName = payload.candidateName ?? "";
      candidateEmail = payload.candidateEmail ?? "";
      registrationId = payload.registrationId ?? "";
      notaBene = payload.notaBene ?? "";
      cabinet = payload.cabinet ?? "";
      departement = payload.departement ?? "";
    }
  } catch (err) {
    console.error("Failed to parse body:", err);
    return new Response(JSON.stringify({ error: "invalid body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!candidateEmail) {
    return new Response(JSON.stringify({ error: "missing candidateEmail" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // On n'envoie PAS d'email au candidat ici — Supabase Auth gère déjà l'email de confirmation
  // On envoie uniquement une notification à l'admin pour information préliminaire
  const notaBeneBlock = notaBene
    ? `<div style="margin-top:20px;padding:14px 16px;background:#f5f5f5;border-left:3px solid #000;border-radius:2px;">
        <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#888;font-family:sans-serif;">Nota Bene</p>
        <p style="margin:0;font-size:14px;color:#1a1a1a;font-family:sans-serif;">${notaBene}</p>
      </div>`
    : "";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Logan <noreply@loganexecutive.com>",
      to: ADMIN_EMAIL,
      subject: `Nouvelle inscription en cours — ${candidateName}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
          <p style="font-family:'Georgia',serif;font-size:28px;font-weight:300;margin:0 0 24px;letter-spacing:0.04em;">Logan</p>
          <h2 style="font-weight:400;font-size:18px;margin:0 0 16px;">Nouvelle inscription en cours de confirmation</h2>
          <p><strong>Nom :</strong> ${candidateName}</p>
          <p><strong>Email :</strong> ${candidateEmail}</p>
          ${cabinet ? `<p><strong>Cabinet :</strong> ${cabinet}</p>` : ""}
          ${departement ? `<p><strong>Département :</strong> ${departement}</p>` : ""}
          ${notaBeneBlock}
          <p style="color:#888;font-size:13px;margin-top:20px;">Le candidat doit encore confirmer son email. Vous recevrez une notification dès que c'est fait.</p>
        </div>
      `,
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
