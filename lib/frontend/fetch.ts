import {
  AccountTypes,
  DebitItemTableColNames,
  PaymentIntentsTableColNames,
  RelayerTopupHistoryColNames,
  RelayerTxHistoryColNames,
} from "../enums.ts";
import { ChainIds } from "../shared/web3.ts";

export function redirectToAccountPage(
  commitment: string,
) {
  window.location.href = `/app/account?q=${commitment}`;
}

export function redirectToAccountsPage() {
  window.location.href = "/app/accounts";
}

export function redirectToRedirectPage(
  redirectUrl: string,
  paymentIntent: string,
) {
  window.location.href = `${redirectUrl}?paymentIntent=${paymentIntent}`;
}

export type ProfileData = {
  firstname: string;
  lastname: string;
  addressline1: string;
  addressline2: string;
  city: string;
  postcode: string;
  country: string;
  userid: string;
};

export async function requestBalanceRefresh(
  commitment: string,
  networkId: string,
  calledFrom: "app" | "buyPage",
) {
  // If I call refresh balance from the app route then I don't need to have app in the url!
  const getUrl = calledFrom === "app"
    ? "refreshbalance"
    : "app/post/refreshbalance";
  return await fetch(getUrl, {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify({ commitment, networkId }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.status);
}

export interface UpdateProfileDataArgs {
  firstname: string;
  lastname: string;
  addressline1: string;
  addressline2: string;
  city: string;
  postcode: string;
  country: string;
}

export async function uploadProfileData(args: UpdateProfileDataArgs) {
  return await fetch("app/post/checkoutprofiledata", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.status);
}

export interface UploadPaymentIntentArgs {
  button_id: string;
  proof: string;
  publicSignals: string;
  maxDebitAmount: string;
  debitTimes: number;
  debitInterval: number;
  paymentIntent: string;
  commitment: string;
}

export async function uploadPaymentIntent(args: UploadPaymentIntentArgs) {
  return await fetch("/app/post/savePaymentIntent", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.status);
}

export interface PostRelayerTopup {
  chainId: string;
  blockNumber: string;
  transactionHash: string;
  from: string;
  amount: string;
}

export async function postRelayerTopup(args: PostRelayerTopup) {
  return await fetch("/app/relayer", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.status);
}

export async function logoutRequest() {
  return await fetch("/logout", {
    credentials: "same-origin",
    method: "GET",
  }).then((response) => response.status);
}

export async function updatePaymentIntentToClosed(
  args: { chainId: ChainIds; paymentIntent: string; accountType: AccountTypes },
) {
  return await fetch("/app/createdPaymentIntents", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.status);
}

export async function requestDynamicPayment(
  args: {
    paymentIntent: string;
    chainId: ChainIds;
    requestedDebitAmount: string;
  },
) {
  return await fetch("/app/payeePaymentIntents", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response);
}

export async function cancelDynamicPaymentRequest(
  args: {
    dynamicPaymentRequestId: number;
  },
) {
  return await fetch("/app/post/cancelDynamicPayment", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response);
}

export async function fetchPaginatedPaymentIntentsForAccount(args: {
  accountId: number;
  currentPage: number;
  searchTerm: string;
  sortBy: PaymentIntentsTableColNames;
  sortDirection: "ASC" | "DESC";
}) {
  return await fetch("/app/pagination/accountPaymentIntents", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response);
}
export async function fetchPaginatedSubscriptionsForUserId(args: {
  currentPage: number;
  searchTerm: string;
  sortBy: PaymentIntentsTableColNames;
  sortDirection: "ASC" | "DESC";
}) {
  return await fetch("/app/pagination/subscriptions", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response);
}

export async function fetchPaginatedPaymentIntentsForDebitItems(args: {
  currentPage: number;
  searchTerm: string;
  sortBy: PaymentIntentsTableColNames;
  sortDirection: "ASC" | "DESC";
}) {
  return await fetch("/app/pagination/debitItemsPaymentIntents", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response);
}

export async function fetchPaginatedPaymentIntentsForItem(args: {
  debit_item_id: number;
  currentPage: number;
  searchTerm: string;
  sortBy: PaymentIntentsTableColNames;
  sortDirection: "ASC" | "DESC";
}) {
  return await fetch("/app/pagination/itemPaymentIntents", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response);
}

export async function fetchPaginatedDebitItems(args: {
  currentPage: number;
  searchTerm: string;
  sortBy: DebitItemTableColNames;
  sortDirection: "ASC" | "DESC";
}) {
  return await fetch("/app/pagination/debitItems", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response);
}

export async function fetchPaginatedRelayerTopupHistory(args: {
  currentPage: number;
  searchTerm: string;
  sortBy: RelayerTopupHistoryColNames;
  sortDirection: "ASC" | "DESC";
}) {
  return await fetch("/app/pagination/relayerTopupHistory", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response);
}

export async function fetchPaginatedTxHistory(args: {
  currentPage: number;
  searchTerm: string;
  sortBy: RelayerTxHistoryColNames;
  sortDirection: "ASC" | "DESC";
}) {
  return await fetch("/app/pagination/relayerTxHistory", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response);
}

export async function fetchPaginatedTxHistoryByPaymentIntentId(args: {
  paymentIntent_id: number;
  currentPage: number;
  searchTerm: string;
  sortBy: RelayerTxHistoryColNames;
  sortDirection: "ASC" | "DESC";
}) {
  return await fetch("/app/pagination/relayerTxHistoryWithPaymentIntentId", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response);
}

export async function saveAccount(args: {
  name: string;
  networkId: string;
  commitment: string;
  currency: string;
  accountType: AccountTypes;
  accountAccess: string;
  authenticator_credential_id: string
}) {
  return await fetch("/app/post/saveAccountAPI", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response);
}

export async function fetchPaginatedAccessTokens(args: {
  currentPage: number;
  sortDirection: "ASC" | "DESC";
}) {
  return await fetch("/app/pagination/accessTokens", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response);
}

export async function deleteAccessToken(
  args: {
    accesstoken: string;
  },
) {
  return await fetch("/app/manage_api/rest", {
    credentials: "same-origin",
    method: "DELETE",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response);
}
interface WebhookStoredProcedureFormatArgs {
  webhookurl: string;
  _authorization_arg: string;
  onsubscriptioncreated: boolean;
  onsubscriptioncancelled: boolean;
  onpaymentsuccess: boolean;
  onpaymentfailure: boolean;
  ondynamicpaymentrequestrejected: boolean;
}

export async function updateWebhookUrl(
  args: WebhookStoredProcedureFormatArgs,
) {
  return await fetch("/app/manage_api/webhooks", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response);
}

export async function requestNewPasskeyRegistration() {
  return await fetch("/app/webauthn/register", {
    credentials: "same-origin",
    method: "GET",
  }).then((response) => response);
}

export async function postVerifyPasskeyRegistration(attResp: any) {
  return await fetch("/app/webauthn/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(attResp),
  }).then((response) => response);
}

export async function getAuthenticationOptionsForRevoke() {
  return await fetch("/app/webauthn/revoke", {
    method: "GET",
    credentials: "same-origin",
  }).then((response) => response);
}

export async function verifyAuthenticationForRevoke(asseResp: any) {
  return await fetch("/app/webauthn/revoke", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(asseResp),
  });
}

export async function getAuthenticationOptionsForCheckout() {
  return await fetch("/app/webauthn/verify", {
    method: "GET",
    credentials: "same-origin",
  }).then((response) => response);
}

export async function deleteWebhooks() {
  return await fetch("/app/manage_api/webhooks", {
    method: "DELETE",
    credentials: "same-origin",
  }).then((response) => response);
}

export async function getAuthenticationOptionsForAccount() {
  return await fetch("/app/webauthn/accountRegister", {
    credentials: "same-origin",
    method: "GET",
  }).then((response) => response);
}

export async function postVerifyPasskeyRegistrationForAccount(attResp: any) {
  return await fetch("/app/webauthn/accountRegister", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(attResp),
  }).then((response) => response);
}
