import { createClient } from "@supabase/supabase-js";

export function getContext() {
  const client = createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_KEY") || "",
    { auth: { persistSession: false } },
  );
  return {
    state: {
      supabaseClient: client,
    },
  };
}
