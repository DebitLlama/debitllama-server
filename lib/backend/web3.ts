import { ethers, ZeroAddress } from "$ethers";
import DirectDebitArtifact from "../../static/DirectDebit.json" assert {
  type: "json",
};
import {
  ChainIds,
  getDirectDebitContractAddress,
  rpcUrl,
} from "../shared/web3.ts";

export function validateAddress(address: string) {
  return ethers.isAddress(address);
}

export function getProvider(networkId: string) {
  const url = rpcUrl[networkId as ChainIds];
  return new ethers.JsonRpcProvider(url);
}

// I need to implement the server side Contract functions here with ethers js
export function getContract(provider: any, networkId: string) {
  const address = getDirectDebitContractAddress[networkId as ChainIds];
  return new ethers.Contract(
    address,
    DirectDebitArtifact.abi,
    provider,
  );
}

export async function getAccount(commitment: string, networkId: string) {
  const provider = getProvider(networkId);
  const contract = getContract(provider, networkId);
  const account = await contract.accounts(commitment);
  return { account, exists: account.creator !== ZeroAddress };
}
