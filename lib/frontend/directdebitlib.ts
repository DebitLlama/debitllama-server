export function newAccountSecrets() {
  //@ts-ignore this dependency is imported through a browser script tag
  return directdebitlib.newAccountSecrets();
}

export function decodeAccountSecrets(note: string) {
  //@ts-ignore this dependency is imported through a browser script tag
  return directdebitlib.decodeAccountSecrets(note);
}

export function toNoteHex(number: any) {
  //@ts-ignore this dependency is imported through a browser script tag
  return directdebitlib.toNoteHex(number);
}

export function createPaymentIntent({ paymentIntentSecret, snarkArtifacts }: {
  paymentIntentSecret: PaymentIntentSecret;
  snarkArtifacts?: SnarkArtifacts;
}) {
  //@ts-ignore this dependency is imported through a browser script tag
  return directdebitlib.createPaymentIntent({
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
