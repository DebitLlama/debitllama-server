import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import { aesDecryptData, aesEncryptData } from "../lib/frontend/encryption.ts";

Deno.test("Testing password encryption and decryption", async () => {
  const note = "THISISASTRINGTOENCRYPT";
  const passwd = "password";

  const encryptedData = await aesEncryptData(note, passwd);
  const decryptedData = await aesDecryptData(encryptedData, passwd);
  assertEquals(decryptedData, note);
});
