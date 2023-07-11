export function isEthereumUndefined() {
  //@ts-ignore This runs in the browser only. Checking if the browser has window.ethereum
  return window.ethereum === undefined;
}

export function redirectToMetamask() {
  window.open("https://metamask.io", "_blank");
}

export async function requestAccounts() {
  try {
    //@ts-ignore This runs in the browser only. Requesting accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (err: any) {
    return "Please Connect Your Wallet";
  }
}

//TODO: I need to switch network

//TODO: I need to implement the client side contract functions
