import { formatEther } from "$ethers";
import {
  DynamicPaymentRequestJobsStatus,
  PaymentIntentRow,
  PaymentIntentStatus,
} from "../enums.ts";
import { ChainIds } from "../shared/web3.ts";


//$ Comment means I added it to the query builder!

//SELECTS
//$
export async function selectItemByButtonId(
  supabaseClient: any,
  buttonId: string,
) {
  return await supabaseClient.from("Items").select("*,relayerBalance_id(*)").eq(
    "button_id",
    buttonId,
  );
}
//$
export async function selectOpenAccountsFromUserByNetworkAndCurrency(
  supabaseClient: any,
  userId: string | null,
  networkId: string,
  currency: string,
) {
  return await supabaseClient
    .from("Accounts")
    .select()
    .eq("closed", false)
    .eq("user_id", userId)
    .eq("network_id", networkId)
    .eq("currency", currency);
}
//$
export async function selectProfileByUserId(
  supabaseClient: any,
  userId: string | null,
) {
  return await supabaseClient.from("Profiles").select().eq("userid", userId);
}
//$
export async function selectAccountByCommitment(
  supabaseClient: any,
  commitment: string,
) {
  return await supabaseClient.from("Accounts").select().eq(
    "commitment",
    commitment,
  );
}
//$
export async function selectOpenAccountsByIdDESC(
  supabaseClient: any,
  userId: string | null,
) {
  return await supabaseClient
    .from("Accounts")
    .select()
    .eq("user_id", userId)
    .eq("closed", false)
    .order("last_modified", { ascending: false });
}
//$
export async function selectPaymentIntentsByUserIdDESC(
  supabaseClient: any,
  userId: string | null,
) {
  return await supabaseClient
    .from("PaymentIntents").select("*,debit_item_id(*)").eq(
      "creator_user_id",
      userId,
    ).order(
      "created_at",
      { ascending: false },
    );
}
//$
export async function selectPaymentIntentsByAccountBalanceTooLow(
  supabaseClient: any,
  userId: string | null,
) {
  return await supabaseClient
    .from("PaymentIntents").select("*,debit_item_id(*)").eq(
      "creator_user_id",
      userId,
    ).eq("statusText", PaymentIntentStatus.ACCOUNTBALANCETOOLOW).order(
      "created_at",
      { ascending: false },
    );
}
//$
export async function selectPaymentIntentsByRelayerBalanceTooLow(
  supabaseClient: any,
  userId: string | null,
  network: ChainIds,
) {
  return await supabaseClient
    .from("PaymentIntents").select("*")
    .eq("payee_user_id", userId)
    .eq("network", network)
    .eq("statusText", PaymentIntentStatus.BALANCETOOLOWTORELAY);
}
//$
export async function selectPaymentIntentByPaymentIntentAndCreatorUserId(
  supabaseClient: any,
  paymentIntent: string,
  userId: string | null,
) {
  return await supabaseClient.from("PaymentIntents")
    .select("*,debit_item_id(*),account_id(*)")
    .eq("paymentIntent", paymentIntent)
    .eq("creator_user_id", userId);
}
//$
export async function selectRelayerHistoryById(
  supabaseClient: any,
  paymentIntentId: number,
) {
  return await supabaseClient.from("RelayerHistory")
    .select("*")
    .eq("paymentIntent_id", paymentIntentId);
}
//$
export async function selectRelayerHistoryByUserId(
  supabaseClient: any,
  user_id: string | null,
) {
  return await supabaseClient.from("RelayerHistory")
    .select("*")
    .eq("payee_user_id", user_id);
}
//$
export async function selectPaymentIntentByPaymentIntentAndPayeeUserId(
  supabaseClient: any,
  paymentIntent: string,
  payee_user_id: string | null,
) {
  return await supabaseClient.from("PaymentIntents").select(
    "*,debit_item_id(*),account_id(*)",
  ).eq(
    "paymentIntent",
    paymentIntent,
  ).eq("payee_user_id", payee_user_id);
}
//$
export async function selectItemsByPayeeIdDesc(
  supabaseClient: any,
  payeeId: string | null,
) {
  return await supabaseClient.from("Items").select().eq("payee_id", payeeId)
    .order("created_at", { ascending: false });
}

//$
export async function selectPaymentIntentsByPayeeAndItem(
  supabaseClient: any,
  userId: string | null,
  debit_item_id: string,
) {
  return await supabaseClient.from("PaymentIntents")
    .select("*,account_id(balance,currency)").eq("payee_user_id", userId).eq(
      "debit_item_id",
      debit_item_id,
    ).order("created_at", { ascending: false });
}
//$
export async function selectRelayerBalanceByUserId(
  supabaseClient: any,
  userId: string | null,
) {
  return await supabaseClient.from("RelayerBalance").select().eq(
    "user_id",
    userId,
  );
}
//$
export async function selectRelayerTopUpHistoryDataByTransactionHash(
  supabaseClient: any,
  transactionHash: string,
) {
  return await supabaseClient
    .from("RelayerTopUpHistory")
    .select()
    .eq("transactionHash", transactionHash);
}
//$
export async function selectRelayerTopUpHistoryDataByUserId(
  supabaseClient: any,
  userId: string | null,
) {
  return await supabaseClient.from("RelayerTopUpHistory").select().eq(
    "user_id",
    userId,
  ).order("created_at", { ascending: false });
}
//$
export async function selectDynamicPaymentRequestJobByPaymentIntentIdAndUserId(
  supabaseClient: any,
  userid: string | null,
  paymentIntent_id: number,
) {
  return await supabaseClient.from("DynamicPaymentRequestJobs")
    .select("*,paymentIntent_id(*)")
    .eq("paymentIntent_id", paymentIntent_id)
    .eq("request_creator_id", userid);
}
//$
export async function selectDynamicPaymentRequestJobById(
  supabaseClient: any,
  id: number,
) {
  return await supabaseClient.from("DynamicPaymentRequestJobs")
    .select("*,relayerBalance_id(*),paymentIntent_id(*)").eq("id", id);
}
//INSERTS
//$
export async function insertNewAccount(
  supabaseClient: any,
  user_id: string | null,
  network_id: string,
  commitment: string,
  name: string,
  currency: string,
  balance: string,
) {
  return await supabaseClient.from("Accounts").insert({
    created_at: new Date().toISOString(),
    user_id,
    network_id,
    commitment,
    name,
    closed: false,
    currency,
    balance: formatEther(balance),
    last_modified: new Date().toISOString(),
  });
}
//$
export async function insertNewItem(
  supabaseClient: any,
  payee_id: string | null,
  payee_address: string,
  currency: string,
  max_price: string,
  debit_times: string,
  debit_interval: string,
  redirect_url: string,
  pricing: string,
  network: string,
  name: string,
  relayerBalance_id: string,
) {
  return await supabaseClient.from("Items").insert({
    created_at: new Date().toISOString(),
    payee_id,
    payee_address,
    currency,
    max_price,
    debit_times,
    debit_interval,
    redirect_url,
    pricing,
    network,
    name,
    relayerBalance_id,
  });
}
//$
export async function insertProfile(
  supabaseClient: any,
  userid: string | null,
  walletaddress: string,
  firstname: string,
  lastname: string,
  addressline1: string,
  addressline2: string,
  city: string,
  postcode: string,
  country: string,
) {
  return await supabaseClient.from("Profiles").insert({
    userid,
    walletaddress,
    firstname,
    lastname,
    addressline1,
    addressline2,
    city,
    postcode,
    country,
  });
}
//$
export async function insertFeedback(
  supabaseClient: any,
  creator_id: string | null,
  subject: string,
  message: string,
) {
  return await supabaseClient
    .from("Feedback").insert(
      {
        creator_id,
        subject,
        message,
      },
    ).select();
}
//$
export async function insertPaymentIntent(
  supabaseClient: any,
  creator_user_id: string | null,
  payee_user_id: string,
  account_id: string,
  payee_address: string,
  maxDebitAmount: string,
  debitTimes: string,
  debitInterval: string,
  paymentIntent: string,
  commitment: string,
  estimatedGas: string,
  statusText: string,
  pricing: string,
  currency: string,
  network: string,
  debit_item_id: string,
  proof: string,
  publicSignals: string,
  relayerBalance_id: number,
) {
  return await supabaseClient.from(
    "PaymentIntents",
  ).insert({
    created_at: new Date().toISOString(),
    creator_user_id,
    payee_user_id,
    account_id,
    payee_address,
    maxDebitAmount,
    debitTimes,
    debitInterval,
    paymentIntent,
    commitment,
    estimatedGas,
    statusText,
    lastPaymentDate: null,
    nextPaymentDate: new Date().toDateString(),
    pricing,
    currency,
    network,
    debit_item_id,
    proof,
    publicSignals,
    relayerBalance_id,
  });
}
//$
export async function insertNewRelayerBalance(
  supabaseClient: any,
  userid: string | null,
) {
  return await supabaseClient.from("RelayerBalance").insert({
    created_at: new Date().toISOString(),
    user_id: userid,
  });
}
//$
export async function insertNewRelayerTopUpHistory(
  supabaseClient: any,
  userid: string | null,
  transactionHash: string,
  chainId: ChainIds,
  addedBalance: string,
) {
  return await supabaseClient.from("RelayerTopUpHistory")
    .insert({
      created_at: new Date().toISOString(),
      transactionHash,
      user_id: userid,
      network: chainId,
      Amount: addedBalance,
    });
}

/**
 * There should be only one dynamic payment request job per paymentIntent
 * @param supabaseClient
 * @param userid
 * @param paymentIntent_id
 * @param requestedAmount
 * @returns
 */
//$
export async function insertDynamicPaymentRequestJob(
  supabaseClient: any,
  userid: string | null,
  paymentIntent_id: number,
  requestedAmount: string,
  allocatedGas: string,
  relayerBalance_id: number,
) {
  return await supabaseClient.from("DynamicPaymentRequestJobs").insert({
    created_at: new Date().toISOString(),
    paymentIntent_id,
    requestedAmount,
    status: DynamicPaymentRequestJobsStatus.CREATED,
    request_creator_id: userid,
    allocatedGas,
    relayerBalance_id,
  });
}

//UPDATES
//$
export async function updateAccount(
  supabaseClient: any,
  balance: string,
  closed: boolean,
  id: string,
) {
  return await supabaseClient
    .from("Accounts")
    .update({
      balance: formatEther(balance),
      closed,
      last_modified: new Date().toISOString(),
    }).eq("id", id);
}
//$
export async function updateItem(
  supabaseClient: any,
  deleted: boolean,
  payee_id: string | null,
  button_id: string,
) {
  return await supabaseClient.from("Items")
    .update({ deleted }).eq("payee_id", payee_id).eq(
      "button_id",
      button_id,
    );
}
//$
export async function updatePaymentItemStatus(
  supabaseClient: any,
  status: PaymentIntentStatus,
  paymentIntent: string,
) {
  return await supabaseClient.from("PaymentIntents").update({
    statusText: status,
  }).eq("paymentIntent", paymentIntent);
}
//$
export async function updateItemPaymentIntentsCount(
  supabaseClient: any,
  payment_intents_count: number,
  button_id: string,
) {
  return await supabaseClient.from("Items").update({
    payment_intents_count,
  }).eq("button_id", button_id);
}
//$
export async function updateBTT_Donau_Testnet_Balance(
  supabaseClient: any,
  newRelayerBalance: bigint,
  relayerBalance_id: number,
) {
  await supabaseClient.from("RelayerBalance").update({
    BTT_Donau_Testnet_Balance: formatEther(newRelayerBalance),
  }).eq("id", relayerBalance_id);
}
//$
export async function updateMissing_BTT_Donau_Testnet_Balance(
  supabaseClient: any,
  newBalance: bigint,
  newMissingBalance: bigint,
  id: number,
) {
  return await supabaseClient.from("RelayerBalance").update({
    BTT_Donau_Testnet_Balance: formatEther(newBalance),
    last_topup: new Date().toISOString(),
    Missing_BTT_Donau_Testnet_Balance: formatEther(newMissingBalance),
  }).eq("id", id);
}



/**
 * There should be only one dynamic payment request job per paymentIntent, we updating that!
 * @param supabaseClient
 * @param userid
 * @param paymentIntent_id
 * @param requestedAmount
 * @returns
 */
//$
export async function updateDynamicPaymentRequestJob(
  supabaseClient: any,
  userid: string | null,
  paymentIntent_id: number,
  requestedAmount: string,
  allocatedGas: string,
) {
  return await supabaseClient.from("DynamicPaymentRequestJobs").update({
    created_at: new Date().toISOString(),
    requestedAmount,
    status: DynamicPaymentRequestJobsStatus.CREATED,
    allocatedGas,
  }).eq("paymentIntent_id", paymentIntent_id)
    .eq("request_creator_id", userid);
}
//$
export async function updatePaymentIntentAccountBalanceTooLowDynamicPayment(
  arg: {
    chainId: ChainIds;
    supabaseClient: any;
    paymentIntentRow: PaymentIntentRow;
  },
) {
  // TODO: Could send an email after this, to notify the user about account balance too low!
  // Also notify the merchant! Maybe hit a webhook too and send an email!
  await arg.supabaseClient.from("PaymentIntents").update({
    statusText: PaymentIntentStatus.ACCOUNTBALANCETOOLOW,
  }).eq("id", arg.paymentIntentRow.id);
}


// UPSERT
//$
export async function upsertProfile(
  supabaseClient: any,
  id: string,
  walletaddress: string,
  firstname: string,
  lastname: string,
  addressline1: string,
  addressline2: string,
  city: string,
  postcode: string,
  country: string,
  userid: string | null,
) {
  return await supabaseClient
    .from("Profiles").upsert(
      {
        id,
        walletaddress,
        firstname,
        lastname,
        addressline1,
        addressline2,
        city,
        postcode,
        country,
        userid,
      },
      { ignoreDuplicates: false },
    ).select();
}

//DELETE
//$
export async function deleteDynamicPaymentRequestJobById(
  supabaseClient: any,
  id: number,
  user_id: string | null,
) {
  // Delete dynamic payment request job by id where status is not locked
  return await supabaseClient.from("DynamicPaymentRequestJobs")
    .delete()
    .eq("request_creator_id", user_id)
    .eq("id", id)
    .neq(
      "status",
      DynamicPaymentRequestJobsStatus.LOCKED,
    );
}
