import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "contact@loganexecutive.com";
const APP_URL = "https://loganexecutive.com";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { candidateId, cabinetUserId } = await req.json();

    // Récupérer les infos du cabinet depuis auth.users
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(cabinetUserId);
    const meta = userData?.user?.raw_user_meta_data || {};
    const cabinetName = meta.cabinet_name || "—";
    const contactPrenom = meta.contact_prenom || "";
    const contactNom = meta.contact_nom || "";
    const contactEmail = userData?.user?.email || "—";
    const contactTel = meta.contact_mobile || "—";
    const contactRole = meta.contact_role || "—";

    // Récupérer un minimum d'infos sur le candidat (anonymisé)
    const { data: regRow } = await supabaseAdmin
      .from("candidate_registrations")
      .select("id, created_at, submission_data")
      .eq("id", candidateId)
      .single();

    const sd = regRow?.submission_data || {};
    const pratique = sd.departement || "—";
    const seniority = sd.sermentAnnee ? `${new Date().getFullYear() - parseInt(sd.sermentAnnee)} ans de PQE` : "—";

    // Envoyer un email à Logan
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Logan <noreply@loganexecutive.com>",
        to: ADMIN_EMAIL,
        subject: `Intérêt cabinet — ${cabinetName} pour un profil ${pratique}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
            <p style="font-family:'Georgia',serif;font-size:32px;font-weight:300;margin:0 0 28px;letter-spacing:0.06em;">Logan</p>
            <h2 style="font-family:'Georgia',serif;font-weight:400;font-size:20px;margin:0 0 8px;">Un cabinet manifeste son intérêt</h2>
            <p style="font-size:13px;color:#555;margin:0 0 28px;font-weight:300;">Le cabinet suivant a indiqué son intérêt pour un profil candidat.</p>

            <p style="font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#999;margin:0 0 12px;">Cabinet</p>
            <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:28px;">
              <tr><td style="padding:8px 0;color:#666;width:140px;">Cabinet</td><td style="padding:8px 0;font-weight:600;">${cabinetName}</td></tr>
              <tr style="border-top:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Contact</td><td style="padding:8px 0;font-weight:600;">${contactPrenom} ${contactNom}</td></tr>
              <tr style="border-top:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Rôle</td><td style="padding:8px 0;">${contactRole}</td></tr>
              <tr style="border-top:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;">${contactEmail}</td></tr>
              <tr style="border-top:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Téléphone</td><td style="padding:8px 0;">${contactTel}</td></tr>
            </table>

            <p style="font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#999;margin:0 0 12px;">Profil candidat</p>
            <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:28px;">
              <tr><td style="padding:8px 0;color:#666;width:140px;">ID</td><td style="padding:8px 0;font-family:monospace;font-size:12px;">${candidateId}</td></tr>
              <tr style="border-top:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Pratique</td><td style="padding:8px 0;font-weight:600;">${pratique}</td></tr>
              <tr style="border-top:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Séniorité</td><td style="padding:8px 0;">${seniority}</td></tr>
            </table>

            <a href="${APP_URL}/admin/profils" style="display:inline-block;padding:14px 28px;background:#000;color:#fff;text-decoration:none;font-family:sans-serif;font-size:13px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;">
              Voir le profil →
            </a>
            <p style="color:#999;font-size:12px;margin-top:24px;">— L'équipe Logan</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error: ${err}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
