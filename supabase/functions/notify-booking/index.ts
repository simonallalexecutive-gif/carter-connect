import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "contact@loganexecutive.com";
const APP_URL = Deno.env.get("APP_URL") ?? "https://loganexecutive.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let name: string, email: string, date: string, time: string, cabinet: string, source: string;

  try {
    const payload = await req.json();
    name = payload.name ?? "Inconnu";
    email = payload.email ?? "";
    date = payload.date ?? "";
    time = payload.time ?? "";
    cabinet = payload.cabinet ?? "";
    source = payload.source ?? "landing";
  } catch {
    return new Response(JSON.stringify({ error: "invalid body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const sourceLabel =
    source === "candidat" ? "espace candidat" :
    source === "cabinet" ? "espace cabinet" :
    "landing page";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Logan <noreply@loganexecutive.com>",
      to: ADMIN_EMAIL,
      subject: `Nouveau RDV — ${name} · ${date} à ${time}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="font-weight: 400;">Nouveau rendez-vous pris</h2>
          <p><strong>Nom :</strong> ${name}</p>
          ${email ? `<p><strong>Email :</strong> ${email}</p>` : ""}
          ${cabinet ? `<p><strong>Cabinet :</strong> ${cabinet}</p>` : ""}
          <p><strong>Date :</strong> ${date}</p>
          <p><strong>Heure :</strong> ${time}</p>
          <p><strong>Source :</strong> ${sourceLabel}</p>
          <a href="${APP_URL}/admin/agenda" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:4px;">
            Voir l'agenda
          </a>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Resend error:", text);
  }

  return new Response(JSON.stringify({ success: res.ok }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
