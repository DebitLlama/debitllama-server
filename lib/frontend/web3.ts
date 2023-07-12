import { ethers } from "../../ethers.min.js";
import { SolidityProof } from "./directdebitlib.ts";

export enum NetworkNames {
  BTT_TESTNET = "BTT Donau Testnet",
}
export const availableNetworks = [
  NetworkNames.BTT_TESTNET.toString(),
];

enum NetworkTickers {
  BTT_TESTNET = "BTT",
}

export enum ChainIds {
  BTT_TESTNET_ID = "0x405",
}

enum DirectDebitContractAddress {
  BTT_TESTNET = "",
}

enum RPCURLS {
  BTT_TESTNET = "https://pre-rpc.bt.io/",
}

enum EXPORERURLS {
  BTT_TESTNET = "https://testscan.bt.io",
}

const rpcUrl: { [key in ChainIds]: RPCURLS } = {
  [ChainIds.BTT_TESTNET_ID]: RPCURLS.BTT_TESTNET,
};

const explorerUrl: { [key in ChainIds]: EXPORERURLS } = {
  [ChainIds.BTT_TESTNET_ID]: EXPORERURLS.BTT_TESTNET,
};

const walletCurrency: { [key in ChainIds]: NetworkTickers } = {
  [ChainIds.BTT_TESTNET_ID]: NetworkTickers.BTT_TESTNET,
};

export const getDirectDebitContractAddress: {
  [keys in ChainIds]: DirectDebitContractAddress;
} = {
  [ChainIds.BTT_TESTNET_ID]: DirectDebitContractAddress.BTT_TESTNET,
};

const networkNameFromId: { [key in ChainIds]: NetworkNames } = {
  [ChainIds.BTT_TESTNET_ID]: NetworkNames.BTT_TESTNET,
};

export const chainIdFromNetworkName: { [key in NetworkNames]: ChainIds } = {
  [NetworkNames.BTT_TESTNET]: ChainIds.BTT_TESTNET_ID,
};

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

async function onboardOrSwitchNetwork(networkid: any, handleError: any) {
  if (!isEthereumUndefined()) {
    handleError("You need to install metamask");
    redirectToMetamask();
    return false;
  }
  return await switchNetworkByChainId(networkid);
}

export async function switchNetworkByChainId(netId: ChainIds) {
  const name = networkNameFromId[netId];
  if (!name) {
    // If I can't find the name, the rest will fail too
    return false;
  }
  const curr = walletCurrency[netId];
  const rpcs = [rpcUrl[netId]];
  const blockExplorerUrls = [explorerUrl[netId]];
  const switched = await switch_to_Chain(netId);

  if (!switched) {
    // If I can't switch to it, I try to add it!
    await ethereumRequestAddChain(
      netId,
      name,
      curr,
      curr,
      18,
      rpcs,
      blockExplorerUrls,
    );
  }

  return true;
}

async function ethereumRequestAddChain(
  hexchainId: string,
  chainName: string,
  name: string,
  symbol: string,
  decimals: number,
  rpcUrls: string[],
  blockExplorerUrls: string[],
) {
  //@ts-ignore
  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: hexchainId,
        chainName,
        nativeCurrency: {
          name,
          symbol,
          decimals,
        },
        rpcUrls,
        blockExplorerUrls,
      },
    ],
  });
}

async function switch_to_Chain(chainId: string) {
  try {
    let errorOccured = false;
    //@ts-ignore
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    }).catch((err: any) => {
      if (err.message !== "User rejected the request.") {
        errorOccured = true;
      }
    });
    if (errorOccured) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    return false;
  }
}

export async function fetchAbi(at: string) {
  const res = await fetch(at);
  return res.json();
}

function getWeb3Provider() {
  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  //@ts-ignore
  window.ethereum.on("chainChanged", (chainId) => {
    // Handle the new chain.
    // Correctly handling chain changes can be complicated.
    // We recommend reloading the page unless you have good reason not to.
  });
  return provider;
}

export async function handleNetworkSelect(chainId: string, handleError: any) {
  const onboardsuccess = await onboardOrSwitchNetwork(chainId, handleError);
  if (!onboardsuccess) {
    return false;
  } else {
    const provider = getWeb3Provider();
    return provider;
  }
}

export async function getContract(
  provider: any,
  at: string,
  abiPath: string,
): Promise<any> {
  const artifact = await fetchAbi(abiPath);
  const signer = provider.getSigner();
  return new ethers.Contract(at, artifact.abi, signer);
}
// Smart contract functions start here

export async function depositEth(
  contract: any,
  commitment: string,
  balance: string,
  encryptedNote: string,
) {
  return await contract.depositEth(
    commitment,
    ethers.parseEther(balance),
    encryptedNote,
    { value: ethers.parseEther(balance) },
  );
}

export async function depositToken(
  contract: any,
  commitment: string,
  balance: string,
  token: string,
  encryptedNote: string,
) {
  return await contract.depositToken(commitment, balance, token, encryptedNote);
}

export async function topUpETH(
  contract: any,
  commitment: string,
  balance: string,
) {
  return await contract.topUpETH(
    commitment,
    ethers.parseEther(balance),
    { value: ethers.parseEther(balance) },
  );
}

export async function topUpTokens(
  contract: any,
  commitment: string,
  balance: string,
) {
  return await contract.topUpTokens(commitment, ethers.parseEther(balance));
}

export async function approveSpend(
  erc20Contract: any,
  spender: string,
  amount: string,
) {
  return await erc20Contract.approve(spender, ethers.parseEther(amount));
}

export async function getAllowance(
  erc20Contract: any,
  owner: string,
  spender: string,
) {
  return await erc20Contract.allowance(owner, spender);
}

export async function directDebit(
  contract: any,
  proof: SolidityProof,
  hashes: string[2],
  payee: string,
  debit: {
    maxDebitAmount: string;
    debitTimes: number;
    debitInterval: number;
    payment: string;
  },
) {
  return await contract.directDebit(
    proof,
    hashes,
    payee,
    [
      ethers.parseEther(debit.maxDebitAmount),
      debit.debitTimes,
      debit.debitInterval,
      ethers.parseEther(debit.payment),
    ],
  );
}

export async function cancelPaymentIntent(
  contract: any,
  proof: SolidityProof,
  hashes: string[2],
  payee: string,
  debit: {
    maxDebitAmount: string;
    debitTimes: number;
    debitInterval: number;
    payment: string;
  },
) {
  return await contract.cancelPaymentIntent(
    proof,
    hashes,
    payee,
    [
      ethers.parseEther(debit.maxDebitAmount),
      debit.debitTimes,
      debit.debitInterval,
      ethers.parseEther(debit.payment),
    ],
  );
}

export async function withdraw(contract: any, commitment: string) {
  return await contract.withdraw(commitment);
}

export function parseEther(input: string) {
  return ethers.parseEther(input);
}
