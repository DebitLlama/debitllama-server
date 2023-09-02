import { decrypt } from "@metamask/eth-sig-util";
import { Buffer } from "https://deno.land/x/node_buffer@1.1.0/mod.ts";

export function decryptData(
  privateKey: string,
  encryptedData: string,
) {
  const unpackedCypherText = unpackEncryptedMessage(encryptedData);
  return decrypt({
    encryptedData: unpackedCypherText,
    privateKey: privateKey.substring(2),
  });
}
function unpackEncryptedMessage(encryptedMessage: string) {
  if (encryptedMessage.slice(0, 2) === "0x") {
    encryptedMessage = encryptedMessage.slice(2);
  }
  const messageBuff = Buffer.from(encryptedMessage, "hex");
  const nonceBuf = messageBuff.slice(0, 24) as any;
  const ephemPublicKeyBuf = messageBuff.slice(24, 56) as any;
  const ciphertextBuf = messageBuff.slice(56) as any;
  return {
    version: "x25519-xsalsa20-poly1305",
    nonce: nonceBuf.toString("base64"),
    ephemPublicKey: ephemPublicKeyBuf.toString("base64"),
    ciphertext: ciphertextBuf.toString("base64"),
  };
}
