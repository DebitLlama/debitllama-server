import { PaymentIntentsTableColNames } from "../enums.ts";
import { ChainIds } from "../shared/web3.ts";

export async function saveAccountData(
  networkId: string,
  commitment: string,
  name: string,
  currency: string,
): Promise<number> {
  return await fetch("/app/createdNewAccountApi", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify({ networkId, commitment, name, currency }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.status);
}

export function redirectToAccountPage(
  networkId: string,
  commitment: string,
  name: string,
  currency: string,
) {
  const params = JSON.stringify({ networkId, commitment, name, currency });
  window.location.href = `/app/account?q=${params}`;
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
  walletaddress: string;
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
) {
  return await fetch("app/refreshbalance", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify({ commitment, networkId }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.status);
}

export interface UpdateProfileDataArgs {
  walletaddress: string;
  firstname: string;
  lastname: string;
  addressline1: string;
  addressline2: string;
  city: string;
  postcode: string;
  country: string;
}

export async function uploadProfileData(args: UpdateProfileDataArgs) {
  return await fetch("app/checkoutprofiledata", {
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
  return await fetch("/app/savePaymentIntent", {
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
  args: { chainId: ChainIds; paymentIntent: string },
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
  return await fetch("/app/cancelDynamicPayment", {
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
