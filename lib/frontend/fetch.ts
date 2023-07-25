export async function saveAccountData(
  networkId: string,
  commitment: string,
  name: string,
): Promise<number> {
  return await fetch("/app/addNewAccount", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify({ networkId, commitment, name }),
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
