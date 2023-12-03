import { startAuthentication } from "@simplewebauthn/browser";
import { ethers, ZeroAddress } from "../../ethers.min.js";
import { AccountAccess } from "../enums.ts";
import {
  ChainIds,
  explorerUrl,
  networkNameFromId,
  rpcUrl,
  RPCURLS,
  walletCurrency,
} from "../shared/web3.ts";
import {
  decryptData,
  getPublicKeyFromPrivateKey,
  setUpAccount,
  setUpAccountWithoutPassword,
  SolidityProof,
  unpackEncryptedMessage,
} from "./directdebitlib.ts";
import { aesDecryptData } from "./encryption.ts";
import { getAuthenticationOptionsForLargeBlobRead } from "./fetch.ts";
import { Buffer } from "https://deno.land/x/node_buffer@1.1.0/mod.ts";

export function isEthereumUndefined() {
  //@ts-ignore This runs in the browser only. Checking if the browser has window.ethereum
  return window.ethereum === undefined;
}

export function isZero(addr: string) {
  return addr === ZeroAddress;
}
export function isAddress(addr: string) {
  return ethers.isAddress(addr);
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

export function getJSONRPCProvider(networkId: string) {
  const url = rpcUrl[networkId as ChainIds];
  return new ethers.JsonRpcProvider(url);
}

async function onboardOrSwitchNetwork(networkid: any, handleError: any) {
  if (isEthereumUndefined()) {
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
  //@ts-ignore window.ethereum needs to be ignored. this code runs in the browser
  const provider = new ethers.BrowserProvider(window.ethereum);
  //@ts-ignore window.ethereum needs to be ignored. this code runs in the browser
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

export function getJsonRpcProvider(chainId: string): any {
  const getProvider = (url: RPCURLS) => new ethers.JsonRpcProvider(url);
  const url = rpcUrl[chainId as ChainIds];
  if (!url) {
    return undefined;
  }
  return getProvider(url);
}

export async function getContract(
  provider: any,
  at: string,
  abiPath: string,
): Promise<any> {
  const artifact = await fetchAbi(abiPath);
  const signer = await provider.getSigner();
  return new ethers.Contract(at, artifact.abi, signer);
}

export async function getRpcContract(
  provider: any,
  at: string,
  abiPath: string,
): Promise<any> {
  const artifact = await fetchAbi(abiPath);
  return new ethers.Contract(at, artifact.abi, provider);
}

// Smart contract functions start here

export async function getAccount(contract: any, commitment: string) {
  return await contract.getAccount(commitment);
}

export async function depositEth(
  contract: any,
  commitment: string,
  balance: string,
  encryptedNote: string,
) {
  return await contract.depositEth(
    commitment,
    parseEther(balance),
    encryptedNote,
    { value: parseEther(balance) },
  );
}

export async function depositToken(
  contract: any,
  commitment: string,
  balance: string,
  token: string,
  encryptedNote: string,
) {
  return await contract.depositToken(
    commitment,
    parseEther(balance),
    token,
    encryptedNote,
  );
}

export async function topUpETH(
  contract: any,
  commitment: string,
  balance: string,
) {
  return await contract.topUpETH(
    commitment,
    parseEther(balance),
    { value: parseEther(balance) },
  );
}

export async function topUpTokens(
  contract: any,
  commitment: string,
  balance: string,
) {
  return await contract.topUpTokens(commitment, parseEther(balance));
}

export async function approveSpend(
  erc20Contract: any,
  spender: string,
  amount: string,
) {
  return await erc20Contract.approve(spender, parseEther(amount));
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
      parseEther(debit.maxDebitAmount),
      debit.debitTimes,
      debit.debitInterval,
      parseEther(debit.payment),
    ],
  );
}

export async function cancelPaymentIntent(
  contract: any,
  proof: SolidityProof,
  hashes: Array<string>,
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
      parseEther(debit.maxDebitAmount),
      debit.debitTimes,
      debit.debitInterval,
      parseEther(debit.payment),
    ],
  );
}

export async function withdraw(contract: any, commitment: string) {
  return await contract.withdraw(commitment);
}

export function parseEther(input: string) {
  return ethers.parseEther(`${input}`);
}

export function formatEther(input: any) {
  return ethers.formatEther(input);
}

export async function topupRelayer(contract: any, amount: string) {
  return await contract.topUpRelayer({ value: parseEther(amount) });
}

export async function relayerAddress(contract: any) {
  return await contract.relayer();
}

export async function connectWallet(
  contract: any,
  commitment: string,
  token: string,
  encryptedNote: string,
) {
  return await contract.connectWallet(commitment, token, encryptedNote);
}

export async function disconnectWallet(
  contract: any,
  commitment: string,
) {
  return await contract.disconnectWallet(commitment);
}

export async function connectedWalletAlready(
  contract: any,
  walletaddr: string,
  token: string,
) {
  const hash = await contract.getHashByAddresses(walletaddr, token);
  return await contract.connectedWalletAlready(hash);
}

export async function mintToken(contract: any, address: "string") {
  return await contract.mint(address, parseEther("1000000"));
}

export async function watchAsset(erc20Params: any, onError: any) {
  //@ts-ignore window.ethereum should exist, I run this after onboarding!
  await window.ethereum
    .request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: erc20Params.address,
          symbol: erc20Params.symbol,
          decimals: erc20Params.decimals,
        },
      },
    })
    .then((success: any) => {
      if (!success) {
        onError();
      }
    })
    .catch(console.error);
}

export async function get_EncryptionPublicKey(address: string) {
  //@ts-ignore window.ethereum should exist, I run this after checking for wallet!
  return await window.ethereum.request({
    "method": "eth_getEncryptionPublicKey",
    "params": [
      address,
    ],
  });
}

export async function eth_decrypt(encryptedMessage: any, address: string) {
  //@ts-ignore window.ethereum should exists!
  return await window.ethereum.request({
    "method": "eth_decrypt",
    "params": [
      encryptedMessage,
      address,
    ],
  });
}

/**
 *  This function generates an ethereum private key used only for encryption, the private key is stored inside an authenticator device largeBlob extension!
 * @returns an ethereum private key
 */
export function getRandomEncryptionPrivateKeyBlob() {
  const privateKey = ethers.Wallet.createRandom().privateKey;
  const textEncoder = new TextEncoder();
  return textEncoder.encode(privateKey);
}

export async function switch_setupAccount(
  ethEncryptDebitllamaPublicKey: string,
  password: string,
  address: string,
  accountAccessSelected: AccountAccess,
): Promise<
  [{ commitment: string; encryptedNote: string }, boolean, string]
> {
  switch (accountAccessSelected) {
    case AccountAccess.metamask: {
      try {
        const pubkey = await get_EncryptionPublicKey(address);
        const acc = await setUpAccountWithoutPassword(pubkey);
        return [acc, false, ""];
      } catch (_err) {
        return [
          { commitment: "", encryptedNote: "" },
          true,
          "Unable to create an account!",
        ];
      }
    }
    case AccountAccess.password:
      return [
        await setUpAccount(password, ethEncryptDebitllamaPublicKey),
        false,
        "",
      ];
    case AccountAccess.passkey: {
      const resp = await getAuthenticationOptionsForLargeBlobRead();
      const authenticationJson = await resp.json();
      if (resp.status !== 200) {
        return [
          { commitment: "", encryptedNote: "" },
          true,
          authenticationJson.error,
        ];
      }

      if (!authenticationJson.extensions.largeBlob.read) {
        return [
          { commitment: "", encryptedNote: "" },
          true,
          "Unable to read from passkey",
        ];
      }

      const credentials = await startAuthentication(authenticationJson);
      try {
        //@ts-ignore largeBlob should exist!
        if (Object.keys(credentials.clientExtensionResults.largeBlob).length) {
          const decoder = new TextDecoder();
          const privkey =
            //@ts-ignore should exist!
            decoder.decode(credentials.clientExtensionResults.largeBlob.blob);
          const pubKey = getPublicKeyFromPrivateKey(privkey.substring(2));

          const acc = await setUpAccountWithoutPassword(pubKey);
          return [acc, false, ""];
        } else {
          throw new Error();
        }
      } catch (_err) {
        return [
          { commitment: "", encryptedNote: "" },
          true,
          "Unable to read passkey data!",
        ];
      }
    }
    default:
      throw new Error("Invalid account access selected!");
  }
}

export async function switch_recoverAccount(
  account_access: AccountAccess,
  cipherNote: string,
  password: string,
  chainId: ChainIds,
  handleError: any,
) {
  switch (account_access) {
    case AccountAccess.metamask: {
      const provider = await handleNetworkSelect(chainId, handleError);

      if (!provider) {
        return "";
      }
      const address = await requestAccounts();
      const unpacked = unpackEncryptedMessage(cipherNote);
      const buff = Buffer.from(JSON.stringify(unpacked), "utf-8");
      return await eth_decrypt("0x" + buff.toString("hex"), address).catch(
        (_err) => {
          return "";
        },
      );
    }
    case AccountAccess.password: {
      return await aesDecryptData(cipherNote, password);
    }
    case AccountAccess.passkey: {
      const resp = await getAuthenticationOptionsForLargeBlobRead();
      const authenticationJson = await resp.json();
      if (resp.status !== 200) {
        return "";
      }
      if (!authenticationJson.extensions.largeBlob.read) {
        return "";
      }
      const credentials = await startAuthentication(authenticationJson);
      try {
        //@ts-ignore largeBlob should exist!
        if (Object.keys(credentials.clientExtensionResults.largeBlob).length) {
          const decoder = new TextDecoder();
          const privkey =
            //@ts-ignore should exist!
            decoder.decode(credentials.clientExtensionResults.largeBlob.blob);

          const unpacked = unpackEncryptedMessage(cipherNote);

          return decryptData(privkey, unpacked);
        } else {
          throw new Error();
        }
      } catch (_err) {
        return "";
      }
    }
    default:
      return "";
  }
}
