import { aesEncryptData } from "./encryption.ts";

export const ETHENCRYPTPUBLICKEY = "";

export async function setUpAccount(
  password: string,
  ethEncryptPublicKey: string,
) {
  const note = newAccountSecrets();
  const secrets = decodeAccountSecrets(note);
  const commitment = toNoteHex(secrets.commitment);
  //Password encrypt the note!
  const passwdEncryptedNote = await aesEncryptData(note, password);
  //Encrypt the note with a public key
  const encryptedNote = await ethEncryptData(
    ethEncryptPublicKey,
    passwdEncryptedNote,
  );

  const packed = await packEncryptedMessage(encryptedNote);

  return { encryptedNote: packed, commitment };
}

export function newAccountSecrets() {
  //@ts-ignore this dependency is imported through a browser script tag
  return directdebitlib.newAccountSecrets();
}

export function decodeAccountSecrets(note: string) {
  //@ts-ignore this dependency is imported through a browser script tag
  return directdebitlib.decodeAccountSecrets(note);
}

export function toNoteHex(number: any): string {
  //@ts-ignore this dependency is imported through a browser script tag
  return directdebitlib.toNoteHex(number);
}

export async function createPaymentIntent(
  { paymentIntentSecret, snarkArtifacts }: {
    paymentIntentSecret: PaymentIntentSecret;
    snarkArtifacts?: SnarkArtifacts;
  },
) {
  //@ts-ignore this dependency is imported through a browser script tag
  return await directdebitlib.createPaymentIntent({
    paymentIntentSecret,
    snarkArtifacts,
  });
}

export function packToSolidityProof(proof: Proof): SolidityProof {
  //@ts-ignore this dependency is imported through a browser script tag
  return directdebitlib.packToSolidityProof(proof);
}

export function BufferFrom(data: any) {
  //@ts-ignore this dependency is imported through a browser script tag
  return directdebitlib.Buffer.from(data);
}

export function ethEncryptData(publicKey: any, data: any) {
  //@ts-ignore this dependency is imported through a browser script tag
  return directdebitlib.encryptData(publicKey, data);
}

export function packEncryptedMessage(encryptedMessage: any) {
  //@ts-ignore this dependency is imported through a browser script tag
  return directdebitlib.packEncryptedMessage(encryptedMessage);
}

export type PaymentIntentSecret = {
  note: string;
  payee: string;
  maxDebitAmount: string;
  debitTimes: number;
  debitInterval: number;
};

export type SnarkArtifacts = {
  wasmFilePath: string;
  zkeyFilePath: string;
};

export type Proof = {
  pi_a: BigNumberish[];
  pi_b: BigNumberish[][];
  pi_c: BigNumberish[];
  protocol: string;
  curve: string;
};

export type SolidityProof = [
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
];

export type BigNumberish = string | bigint;
