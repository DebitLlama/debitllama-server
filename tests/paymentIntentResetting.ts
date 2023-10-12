import { createClient } from "@supabase/supabase-js";
import { ChainIds } from "../lib/shared/web3.ts";
import "$std/dotenv/load.ts";
import { findPaymentIntentsThatCanBeReset, getGasPrice } from "../lib/backend/businessLogic.ts";
import QueryBuilder from "../lib/backend/queryBuilder.ts";

// Integration tests on a live database for the query builder!

async function main() {
  //TODO: change this to test db keys!
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
  const select = queryBuilder.select();

  const {
    data: paymentIntentsWithLowBalance,
    error: paymentIntentsWIlLowBalanceError,
  } = await select.PaymentIntents.byRelayerBalanceTooLowAndUserIdForPayee(
    ChainIds.BTT_TESTNET_ID,
  );
  console.log(
    "paymentItnetns low balance err",
    paymentIntentsWIlLowBalanceError,
  );

  console.log(
    "payment Intents with low balance: ",
    paymentIntentsWithLowBalance.length,
  );
  const feeData = await getGasPrice(
    ChainIds.BTT_TESTNET_ID,
  );
  const resetablePaymentIntents = await findPaymentIntentsThatCanBeReset(
    "5000",
    paymentIntentsWithLowBalance,
    feeData,
  );

  console.log("resetable Payment Intents");
  console.log(resetablePaymentIntents);
}

await main();
