import { ethers, ZeroAddress } from "$ethers";
import DirectDebitArtifact from "../../static/DirectDebit.json" with {
  type: "json",
};
import ERC20Artifact from "../../static/ERC20.json" with {
  type: "json",
};

import {
  ChainIds,
  getConnectedWalletsContractAddress,
  getVirtualAccountsContractAddress,
  rpcUrl,
} from "../shared/web3.ts";
import { Buffer } from "https://deno.land/x/node_buffer@1.1.0/mod.ts";
import { AccountTypes } from "../enums.ts";

export function validateAddress(address: string) {
  return ethers.isAddress(address);
}

export function getProvider(networkId: string) {
  const url = rpcUrl[networkId as ChainIds];
  return new ethers.JsonRpcProvider(url);
}

// I need to implement the server side Contract functions here with ethers js
export function getContract(
  provider: any,
  networkId: string,
  accountType: AccountTypes,
) {
  const address = accountType === AccountTypes.VIRTUALACCOUNT
    ? getVirtualAccountsContractAddress[networkId as ChainIds]
    : getConnectedWalletsContractAddress[networkId as ChainIds];

  return new ethers.Contract(
    address,
    DirectDebitArtifact.abi,
    provider,
  );
}

export async function getAccount(
  commitment: string,
  networkId: string,
  accountType: AccountTypes,
) {
  const provider = getProvider(networkId);
  const contract = getContract(provider, networkId, accountType);
  const account = await contract.getAccount(commitment);
  return { account, exists: account.creator !== ZeroAddress };
}

export async function getEncryptedNote(
  commitment: string,
  networkId: string,
  accountType: AccountTypes,
) {
  const provider = getProvider(networkId);
  const contract = getContract(provider, networkId, accountType);
  const encryptedNote = await contract.encryptedNotes(commitment);
  return encryptedNote;
}

export interface DirectDebitArgs {
  proof: any;
  publicSignals: any;
  payeeAddress: string;
  maxDebitAmount: string;
  actualDebitedAmount: string;
  debitTimes: number;
  debitInterval: number;
}

const MOCKADDRESS = "0x8c2d2a0C51f8F9476423476a79A572C46b622D6e";

export async function estimateRelayerGas(
  args: DirectDebitArgs,
  networkId: string,
  accountType: AccountTypes,
) {
  console.log(args);

  const provider = getProvider(networkId);
  const contract = getContract(provider, networkId, accountType);

  const publicSignals =
    typeof args.publicSignals === "string"
      ? JSON.parse(args.publicSignals)
      : args.publicSignals;

  try {
    return await contract.directdebit.estimateGas(
      packToSolidityProof(
        typeof args.proof === "string"
          ? JSON.parse(args.proof)
          : args.proof,
      ),
      [
        toNoteHex(publicSignals[0]),
        toNoteHex(publicSignals[1]),
      ],
      args.payeeAddress,
      [
        parseEther(args.maxDebitAmount),
        args.debitTimes,
        args.debitInterval,
        parseEther(args.actualDebitedAmount),
      ],
      {
        from: MOCKADDRESS,
      },
    );
  } catch (error: any) {
    console.error(
      `estimateGas failed: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`
    );

    const revertData =
      error?.data ??
      error?.info?.error?.data ??
      error?.error?.data;

    console.error(`Revert data: ${revertData ?? "NONE"}`);

    if (revertData) {
      try {
        const decoded = contract.interface.parseError(revertData);

        console.error(
          `Decoded error: ${JSON.stringify({
            name: decoded?.name,
            args: decoded?.args ? Array.from(decoded.args) : undefined,
            signature: decoded?.signature,
            selector: decoded?.selector,
          }, null, 2)}`
        );
      } catch (decodeError: any) {
        console.error(
          `Could not decode revert data: ${decodeError?.message ?? String(decodeError)}`
        );
      }
    }

    throw error;
  }
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
  return ethers.parseEther(`${input}`);
}
export function formatEther(input: any) {
  return ethers.formatEther(input);
}

export function parseUnits(value: string, unit: number) {
  return ethers.parseUnits(value, unit);
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
  accountType: AccountTypes,
) {
  const provider = getProvider(chainId);
  const contract = getContract(provider, chainId, accountType);
  return await contract.paymentIntents(paymentIntent);
}

export async function getAllowance(
  erc20Contract: any,
  owner: string,
  spender: string,
) {
  return await erc20Contract.allowance(owner, spender);
}

export async function balanceOf(
  erc20Contract: any,
  account: string,
) {
  return await erc20Contract.balanceOf(account);
}

export async function getERC20AllowanceAndWalletBalance(
  chainId: ChainIds,
  erc20Address: string,
  creatorAddress: string,
  spenderContract: string,
) {
  const provider = getProvider(chainId);
  const contract = new ethers.Contract(
    erc20Address,
    ERC20Artifact.abi,
    provider,
  );

  const balance = await balanceOf(contract, creatorAddress);
  const allowance = await getAllowance(
    contract,
    creatorAddress,
    spenderContract,
  );

  return { balance, allowance };
}
