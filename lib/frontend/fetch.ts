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
