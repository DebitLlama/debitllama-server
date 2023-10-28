import { createClient } from "@supabase/supabase-js";
import "$std/dotenv/load.ts";
import QueryBuilder from "../lib/backend/db/queryBuilder.ts";

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

  const emailData = await queryBuilder.select().RPC.emailByUserId(
    "10224224-3f34-4781-85bf-04f7529a5196",
  );
  console.log(emailData.data[0].email);
}

await main();
