import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const TARGET_EMAIL = "simonallal.executive@gmail.com";
const NEW_PASSWORD = "07Simsou!";
const CANDIDATE_EMAILS = [
  "simonallal.executive@gmail.com",
  "simon.j.allal@gmail.com",
];

Deno.serve(async (_req) => {
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let targetUser: any = null;
  for (const email of CANDIDATE_EMAILS) {
    const { data, error } = await (admin.auth.admin as any).listUsers({ page: 1, perPage: 1000 });
    if (error) continue;
    targetUser = data.users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
    if (targetUser) break;
  }

  if (!targetUser) {
    return new Response(JSON.stringify({ error: "Admin user not found" }), { status: 404 });
  }

  const { error: updErr } = await (admin.auth.admin as any).updateUserById(targetUser.id, {
    email: TARGET_EMAIL,
    password: NEW_PASSWORD,
    email_confirm: true,
  });

  if (updErr) {
    return new Response(JSON.stringify({ error: updErr.message }), { status: 500 });
  }

  // Ensure admin role
  await admin.from("user_roles").upsert({ user_id: targetUser.id, role: "admin" }, { onConflict: "user_id,role" });

  return new Response(JSON.stringify({ success: true, user_id: targetUser.id, email: TARGET_EMAIL }), {
    headers: { "Content-Type": "application/json" },
  });
});
