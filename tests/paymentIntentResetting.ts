import { createClient } from "@supabase/supabase-js";
import {
  findPaymentIntentsThatCanBeReset,
  selectPaymentIntentsByRelayerBalanceTooLow,
} from "../lib/backend/supabaseQueries.ts";
import { ChainIds } from "../lib/shared/web3.ts";
import "$std/dotenv/load.ts";
import { getGasPrice } from "../lib/backend/web3.ts";

async function main() {
  const client = createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_KEY") || "",
    { auth: { persistSession: false } },
  );
  const {
    data: paymentIntentsWithLowBalance,
    error: paymentIntentsWIlLowBalanceError,
  } = await selectPaymentIntentsByRelayerBalanceTooLow(
    client,
    "10224224-3f34-4781-85bf-04f7529a5196",
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
