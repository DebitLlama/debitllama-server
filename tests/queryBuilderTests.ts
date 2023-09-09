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

  const selectItems = queryBuilder.select().Items;

const items = await selectItems.byButtonId("");

  const selected = await queryBuilder.select().Items.byButtonId(
    "ef8090b3-a038-44c6-b2ad-b69c91b3d2b9",
  );

  console.log(selected);
}

await main();
