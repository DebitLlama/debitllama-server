import { formatEther } from "$ethers";
import { ChainIds } from "../shared/web3.ts";
import { parseEther } from "./web3.ts";

//AUTH
export async function signUp(
  supabaseClient: any,
  email: string,
  password: string,
) {
  return await supabaseClient.auth.signUp({ email, password });
}

export async function signInWithPassword(
  supabaseClient: any,
  email: string,
  password: string,
) {
  return await supabaseClient.auth.signInWithPassword({ email, password });
}

//SELECTS

export async function selectItemByButtonId(
  supabaseClient: any,
  buttonId: string,
) {
  return await supabaseClient.from("Items").select().eq("button_id", buttonId);
}

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

export async function selectProfileByUserId(
  supabaseClient: any,
  userId: string | null,
) {
  return await supabaseClient.from("Profiles").select().eq("userid", userId);
}

export async function selectAccountByCommitment(
  supabaseClient: any,
  commitment: string,
) {
  return await supabaseClient.from("Accounts").select().eq(
    "commitment",
    commitment,
  );
}

export async function selectOpenAccountsByIdDESC(
  supabaseClient: any,
  userId: string | null,
) {
  return await supabaseClient
    .from("Accounts")
    .select()
    .eq("user_id", userId)
    .eq("closed", false)
    .order("created_at", { ascending: false });
}

export async function selectPaymentIntentsByUserIdDESC(
  supabaseClient: any,
  userId: string | null,
) {
  return await supabaseClient
    .from("PaymentIntents").select().eq("creator_user_id", userId).order(
      "created_at",
      { ascending: false },
    );
}

export async function selectPaymentIntentByPaymentIntentAndCreatorUserId(
  supabaseClient: any,
  paymentIntent: string,
  userId: string | null,
) {
  return await supabaseClient.from("PaymentIntents")
    .select()
    .eq("paymentIntent", paymentIntent)
    .eq("creator_user_id", userId);
}

export async function selectPaymentIntentByPaymentIntentAndPayeeUserId(
  supabaseClient: any,
  paymentIntent: string,
  payee_user_id: string | null,
) {
  return await supabaseClient.from("PaymentIntents").select().eq(
    "paymentIntent",
    paymentIntent,
  ).eq("payee_user_id", payee_user_id);
}

export async function selectItemsByPayeeIdDesc(
  supabaseClient: any,
  payeeId: string | null,
) {
  return await supabaseClient.from("Items").select().eq("payee_id", payeeId)
    .order("created_at", { ascending: false });
}

export async function selectPaymentIntentsByPayeeAndItem(
  supabaseClient: any,
  userId: string | null,
  debit_item_id: string,
) {
  return await supabaseClient.from("PaymentIntents")
    .select("*,account_id(balance,currency)").eq("payee_user_id", userId).eq(
      "debit_item_id",
      debit_item_id,
    );
}

export async function selectRelayerBalanceByUserId(
  supabaseClient: any,
  userId: string | null,
) {
  return await supabaseClient.from("RelayerBalance").select().eq(
    "user_id",
    userId,
  );
}

export async function selectRelayerTopUpHistoryDataByTransactionHash(
  supabaseClient: any,
  transactionHash: string,
) {
  return await supabaseClient
    .from("RelayerTopUpHistory")
    .select()
    .eq("transactionHash", transactionHash);
}

export async function selectRelayerTopUpHistoryDataByUserId(
  supabaseClient: any,
  userId: string | null,
) {
  return await supabaseClient.from("RelayerTopUpHistory").select().eq(
    "user_id",
    userId,
  );
}

//INSERTS

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
  });
}

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
  });
}

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
    nextPaymentDate: null,
    pricing,
    currency,
    network,
    debit_item_id,
  });
}

export async function insertNewRelayerBalance(
  supabaseClient: any,
  userid: string | null,
) {
  return await supabaseClient.from("RelayerBalance").insert({
    created_at: new Date().toUTCString(),
    user_id: userid,
  });
}

//UPDATES

export async function updateAccount(
  supabaseClient: any,
  balance: string,
  closed: boolean,
  id: string,
) {
  return await supabaseClient
    .from("Accounts")
    .update({ balance: formatEther(balance), closed }).eq("id", id);
}

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

export async function updateRelayerBalanceAndHistorySwitchNetwork(
  chainId: ChainIds,
  supabaseClient: any,
  userId: string | null,
  addedBalance: string,
  transactionHash: string,
) {
  const { data: relayerBalance, error: relayerBalanceError } =
    await selectRelayerBalanceByUserId(
      supabaseClient,
      userId,
    );

  switch (chainId) {
    case ChainIds.BTT_TESTNET_ID: {
      const bttBalance = parseEther(
        `${relayerBalance[0].BTT_Donau_Testnet_Balance}`,
      );
      const newBalance = parseEther(addedBalance) + bttBalance;
      const id = relayerBalance[0].id;

      await supabaseClient.from("RelayerBalance").update({
        BTT_Donau_Testnet_Balance: formatEther(newBalance),
        last_topup: new Date().toISOString(),
      }).eq("id", id);

      await supabaseClient.from("RelayerTopUpHistory").insert({
        created_at: new Date().toISOString(),
        transactionHash,
        user_id: userId,
        network: chainId,
        Amount: addedBalance,
      });

      break;
    }
    default:
      console.log("default case triggers");
      break;
  }
}

// UPSERT

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
