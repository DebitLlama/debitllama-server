import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import { aesDecryptData, aesEncryptData } from "../lib/frontend/encryption.ts";
import { ethers } from "../ethers.min.js";

Deno.test("Testing password encryption and decryption", async () => {
  const note = "THISISASTRINGTOENCRYPT";
  const passwd = "password";

  const encryptedData = await aesEncryptData(note, passwd);
  const decryptedData = await aesDecryptData(encryptedData, passwd);
  assertEquals(decryptedData, note);
});

Deno.test("encode and decode a string to uint8array for passkey", async () => {
  const wallet =  ethers.Wallet.createRandom();
  const privateKey = wallet.privateKey;
  const encoder = new TextEncoder();
  const view = encoder.encode(privateKey);
  const utf8Decoder = new TextDecoder();
  const decoded = utf8Decoder.decode(view);
  assertEquals(privateKey, decoded);
});
