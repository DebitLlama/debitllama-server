import { createClient } from "@supabase/supabase-js";

const client = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_KEY") || "",
  { auth: { persistSession: false } },
);

export default client;
