import { BufferFrom } from "./directdebitlib.ts";

/**
 * These crypto functions run only in the browser
 */
export enum Status {
  Success,
  Failure,
}
export type Options<T> = {
  status: Status;
  error: any;
  data: T;
};

export function decodeUint8Array(uint8array: Uint8Array): string {
  return new TextDecoder("utf-8").decode(uint8array);
}

export function encodeStringToUint8Array(data: string): Uint8Array {
  return new TextEncoder().encode(data);
}

export async function encryptAccountNote(
  note: string,
  passwd: string,
): Promise<string> {
  const encryptedBytes = await encrypt(
    BufferFrom(note),
    passwd,
  );

  if (encryptedBytes === undefined) {
    throw Error("Failed to encrypt note");
  }

  return decodeUint8Array(encryptedBytes);
}

export async function decryptWallet(
  encryptedNote: string,
  passwd: string,
): Promise<Options<string>> {
  const options: Options<string> = {
    error: "",
    data: "",
    status: Status.Success,
  };

  const onError = (err: any) => {
    options.error = "Unable to decrypt keyfile.";
    options.status = Status.Failure;
  };
  const cipherbytes = BufferFrom(encryptedNote);

  try {
    const decryptedBytes = await decrypt(cipherbytes, passwd, onError);
    const decodedBytes = decodeUint8Array(decryptedBytes);
    options.data = JSON.parse(decodedBytes);
  } catch (err) {
    options.status = Status.Failure;
    options.error = "Unable to decrypt keyfile";
  }
  return options;
}

async function encrypt(startbuff: ArrayBuffer, passwd: string) {
  const plaintextbytes = new Uint8Array(startbuff);
  const pbkdf2iterations = 10000;
  const passphrasebytes = new TextEncoder().encode(passwd);
  const pbkdf2salt = window.crypto.getRandomValues(new Uint8Array(8));
  const passphrasekey = await window.crypto.subtle
    .importKey("raw", passphrasebytes, { name: "PBKDF2" }, false, [
      "deriveBits",
    ])
    .catch((err) => {
      console.log(err);
    });

  let pbkdf2bytes = await window.crypto.subtle
    .deriveBits(
      {
        name: "PBKDF2",
        salt: pbkdf2salt,
        iterations: pbkdf2iterations,
        hash: "SHA-256",
      },
      passphrasekey as CryptoKey,
      384,
    )
    .catch((err) => {
      console.log(err);
    });
  pbkdf2bytes = new Uint8Array(pbkdf2bytes as ArrayBuffer);
  const keybytes = pbkdf2bytes.slice(0, 32);
  const ivbytes = pbkdf2bytes.slice(32);

  const encryptionkey = await window.crypto.subtle.importKey(
    "raw",
    keybytes,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt"],
  );

  let cipherBytes = await window.crypto.subtle
    .encrypt({ name: "AES-CBC", iv: ivbytes }, encryptionkey, plaintextbytes)
    .catch((err) => {
      console.error(err);
    });

  if (!cipherBytes) {
    return;
  }

  cipherBytes = new Uint8Array(cipherBytes);
  //@ts-ignore cipherbytes.length is erroring but this will only run in the browser
  const resultBytes = new Uint8Array(cipherBytes.length + 16);
  resultBytes.set(new TextEncoder().encode("Salted__"));
  resultBytes.set(pbkdf2salt, 8);
  //@ts-ignore cipherBytes is erroring but this will only run in the browser
  resultBytes.set(cipherBytes, 16);
  return resultBytes;
}

async function decrypt(
  cipherbytes: ArrayBuffer,
  passwd: string,
  onError: CallableFunction,
): Promise<Uint8Array> {
  const pbkdf2iterations = 10000;
  const passphrasebytes = new TextEncoder().encode(passwd);
  const pbkdf2salt = cipherbytes.slice(8, 16);
  const passphrasekey = await window.crypto.subtle
    .importKey("raw", passphrasebytes, { name: "PBKDF2" }, false, [
      "deriveBits",
    ])
    .catch((err) => {
      onError(err);
    });

  let pbkdf2bytes = await window.crypto.subtle
    .deriveBits(
      {
        name: "PBKDF2",
        salt: pbkdf2salt,
        iterations: pbkdf2iterations,
        hash: "SHA-256",
      },
      passphrasekey as CryptoKey,
      384,
    )
    .catch((err) => {
      onError(err);
    });
  pbkdf2bytes = new Uint8Array(pbkdf2bytes as ArrayBuffer);

  const keybytes = pbkdf2bytes.slice(0, 32);
  const ivbytes = pbkdf2bytes.slice(32);
  cipherbytes = cipherbytes.slice(16);

  const decryptionKey = await window.crypto.subtle
    .importKey("raw", keybytes, { name: "AES-CBC", length: 256 }, false, [
      "decrypt",
    ])
    .catch((err) => {
      onError(err);
    });
  let plaintextbytes = await window.crypto.subtle
    .decrypt(
      { name: "AES-CBC", iv: ivbytes },
      decryptionKey as CryptoKey,
      cipherbytes,
    )
    .catch((err) => {
      onError(err);
    });

  if (!plaintextbytes) {
    onError("Error Decrypting File, Wrong password.");
  }
  //@ts-ignore playtextbytes is erroring but this will run in the browser
  plaintextbytes = new Uint8Array(plaintextbytes);

  //@ts-ignore playtextbytes is erroring but this will run in the browser
  return plaintextbytes;
}
