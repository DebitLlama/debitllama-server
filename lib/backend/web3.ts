import { ethers, ZeroAddress } from "$ethers";
import DirectDebitArtifact from "../../static/DirectDebit.json" assert {
  type: "json",
};
import RelayerGasTracker from "../../static/RelayerGasTracker.json" assert {
  type: "json",
};
import { RelayerBalance } from "../enums.ts";

import {
  ChainIds,
  getDirectDebitContractAddress,
  getRelayerGasTrackerContractAddress,
  rpcUrl,
} from "../shared/web3.ts";
import { Buffer } from "https://deno.land/x/node_buffer@1.1.0/mod.ts";

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

export function getRelayerTopUpContract(networkId: string) {
  const provider = getProvider(networkId);
  const addr = getRelayerGasTrackerContractAddress[networkId as ChainIds];
  return new ethers.Contract(addr, RelayerGasTracker.abi, provider);
}

export async function getAccount(commitment: string, networkId: string) {
  const provider = getProvider(networkId);
  const contract = getContract(provider, networkId);
  const account = await contract.accounts(commitment);
  return { account, exists: account.creator !== ZeroAddress };
}

export async function getEncryptedNote(commitment: string, networkId: string) {
  const provider = getProvider(networkId);
  const contract = getContract(provider, networkId);
  const encryptedNote = await contract.encryptedNotes(commitment);
  return encryptedNote;
}

interface DirectDebitArgs {
  proof: any;
  publicSignals: any;
  payeeAddress: string;
  maxDebitAmount: string;
  actualDebitedAmount: string;
  debitTimes: number;
  debitInterval: number;
}

export async function estimateRelayerGas(
  args: DirectDebitArgs,
  networkId: string,
) {
  const provider = getProvider(networkId);
  const contract = getContract(provider, networkId);
  const publicSignals = JSON.parse(args.publicSignals);

  return await contract.directdebit.estimateGas(
    packToSolidityProof(JSON.parse(args.proof)),
    [
      toNoteHex(publicSignals[0]),
      toNoteHex(publicSignals[1]),
    ],
    args.payeeAddress,
    [
      ethers.parseEther(args.maxDebitAmount),
      args.debitTimes,
      args.debitInterval,
      ethers.parseEther(args.actualDebitedAmount),
    ],
  );
}

function packToSolidityProof(proof: any) {
  return [
    proof.pi_a[0],
    proof.pi_a[1],
    proof.pi_b[0][1],
    proof.pi_b[0][0],
    proof.pi_b[1][1],
    proof.pi_b[1][0],
    proof.pi_c[0],
    proof.pi_c[1],
  ];
}

/** BigNumber to hex string of specified length */
function toNoteHex(number: any, length = 32) {
  const str = number instanceof Buffer
    //@ts-ignore buffer does have that hex arg
    ? number.toString("hex")
    : BigInt(number).toString(16);
  return "0x" + str.padStart(length * 2, "0");
}

export function parseEther(input: string) {
  return ethers.parseEther(input);
}
export function formatEther(input: any) {
  return ethers.formatEther(input);
}

export async function fetchTopUpEvent(
  contract: any,
  from: string,
  amount: string,
  fromBlockOrHash: any,
) {
  const filter = contract.filters.TopUpEvent(from, parseEther(amount));
  return await contract.queryFilter(filter, fromBlockOrHash);
}

export async function getPaymentIntentHistory(
  chainId: ChainIds,
  paymentIntent: string,
) {
  const provider = getProvider(chainId);
  const contract = getContract(provider, chainId);
  return await contract.paymentIntents(paymentIntent);
}

/**
 * increase the gas limit by 30 percent to make sure the value we use is enough!
 * @param estimatedGasLimit
 * @returns bigint
 */

export const increaseGasLimit = (estimatedGasLimit: bigint) => {
  return (estimatedGasLimit * BigInt(130)) / BigInt(100); // increase by 30%
};

/**
 *  get the gas price for the chainId
 * @param chainId
 * @returns feeData
 */

export async function getGasPrice(chainId: ChainIds) {
  const provider = getProvider(chainId);

  const feeData = await provider.getFeeData();

  return {
    gasPrice: feeData.gasPrice,
    maxFeePerGas: feeData.maxFeePerGas === null
      ? BigInt(0)
      : feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas === null
      ? BigInt(0)
      : feeData.maxPriorityFeePerGas,
  };
}

/**
 * Calculate the gas estimation for a dynamic payment request using the chainid and fee data and an increased gas limit
 * @param chainId
 */

export function calculateGasEstimationPerChain(
  chainId: ChainIds,
  feeData: {
    gasPrice: bigint | null;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
  },
  increasedEstimatedGas: bigint,
) {
  if (feeData.gasPrice === null) {
    return null;
  }
  switch (chainId) {
    case ChainIds.BTT_TESTNET_ID:
      return feeData.gasPrice * increasedEstimatedGas;
    default:
      break;
  }
}

/**
 * Different chains have different rows in the DB for relayer balance!
 * Use this function to access them!
 * @param chainId
 * @param relayerBalance
 * @returns string relayer balance
 */

export function getRelayerBalanceForChainId(
  chainId: ChainIds,
  relayerBalance: RelayerBalance,
) {
  switch (chainId) {
    case ChainIds.BTT_TESTNET_ID:
      return relayerBalance.BTT_Donau_Testnet_Balance;
    default:
      return "0";
  }
}
