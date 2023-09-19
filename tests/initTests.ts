// Tests that run when the appication starts up to verify the environment variables are correct
// If the env vars are not correctly entered it should throw and kill the process!

import { decrypt, encrypt } from "@metamask/eth-sig-util";
import { createClient } from "@supabase/supabase-js";

function encryptData(publicKey: any, data: any) {
  return encrypt({ publicKey, data, version: "x25519-xsalsa20-poly1305" });
}

function decryptData(privateKey: any, encryptedData: any) {
  return decrypt({ encryptedData, privateKey: privateKey.substring(2) });
}

export function ethencryptInitTest() {
  const ethEncryptPublicKey = Deno.env.get("ETHENCRYPTPUBLICKEY") || "";
  const ethEncryptPrivateKey = Deno.env.get("ETHENCRYPTPRIVATEKEY") || "";

  const testData = "testData";
  const cypherTxt = encryptData(ethEncryptPublicKey, testData);
  const decryptedd = decryptData(ethEncryptPrivateKey, cypherTxt);
  if (testData !== decryptedd) {
    throw new Error(
      "The entered environment variables for cryptography are incorrect!!",
    );
  }
}

export async function supabaseEnvVarTests() {
  const client = createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_KEY") || "",
    { auth: { persistSession: false } },
  );
  const { data, error } = await client
    .from("Test")
    .select();

  if (error) {
    throw new Error(error.message);
  }
}
