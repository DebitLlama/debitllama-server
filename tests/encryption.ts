import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import { decryptData, encryptData } from "../lib/frontend/encryption.ts";

Deno.test("Testing password encryption and decryption", async () => {
  const note = "THISISASTRINGTOENCRYPT";
  const passwd = "password";

  const encryptedData = await encryptData(note, passwd);
  const decryptedData = await decryptData(encryptedData, passwd);
  assertEquals(decryptedData, note);
});
