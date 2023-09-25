import { createClient } from "@supabase/supabase-js";
import "$std/dotenv/load.ts";
import QueryBuilder from "../lib/backend/queryBuilder.ts";

async function main() {
  const client = createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_KEY") || "",
    { auth: { persistSession: false } },
  );
  const queryBuilder = new QueryBuilder({
    state: {
      supabaseClient: client,
      userid: "10224224-3f34-4781-85bf-04f7529a5196",
    },
  });

  const query = client.from("Accounts").select();
  query.eq("name", "My another account");
  const res = await query;

  console.log(res)
}

await main();
