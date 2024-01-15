import * as base64 from "https://deno.land/std@0.207.0/encoding/base64.ts";

// I need to decrypt it using TPM, then I need to parse the json and set the env variables

// The cipher env should be injected into the environment by docker or kubernetes etc..
// It needs to be encrypted for the TPM of the device that is running the cluster

export async function configureCipherEnv() {
  const base64CipherEnv = Deno.env.get("CIPHERENV") ?? "";
  const uintCipherEnv = base64.decodeBase64(base64CipherEnv);
  const textDecoder = new TextDecoder();
  const plainBase64Env = await runCommand(
    "gotpm",
    ["unseal"],
    textDecoder.decode(uintCipherEnv),
  );

  const uintPlainEnv = base64.decodeBase64(plainBase64Env);
  // The environment variables are encoded base64 twice
  assignEnv(textDecoder.decode(uintPlainEnv));
}

// This should run gotpm and get the json string output!
async function runCommand(
  commandName: string,
  commandArgs: string[],
  input: string,
): Promise<string> {
  const command = new Deno.Command(commandName, {
    args: commandArgs,
    stdin: "piped",
    stdout: "piped",
  });

  const process = command.spawn();
  const writer = process.stdin.getWriter();
  writer.write(new TextEncoder().encode(input));
  writer.releaseLock();

  await process.stdin.close();

  const result = await process.output();

  const textDecoder = new TextDecoder();
  // console.log("stderr:", textDecoder.decode(result.stderr));
  //TODO: IF error occurs deno should die

  const out = textDecoder.decode(result.stdout);
  if (out.endsWith("\n")) {
    return out.slice(0, out.length - 1);
  } else {
    return out;
  }
}

//set the decrypted secret to the runtime environment!
function assignEnv(plaintext: string) {
  const json = JSON.parse(plaintext);

  const envfields = Object.values(EnvFields);
  envfields.forEach((envkey) => {
    setEnv(envkey, json[envkey]);
  });
}

function setEnv(key: string, value: string) {
  Deno.env.set(key, value);
}

// The fields of the environment variables
enum EnvFields {
  SUPABASE_URL = "SUPABASE_URL",
  SUPABASE_KEY = "SUPABASE_KEY",
  ETHENCRYPTPUBLICKEY = "ETHENCRYPTPUBLICKEY",
  ETHENCRYPTPRIVATEKEY = "ETHENCRYPTPRIVATEKEY",
  TESTACCESSTOKEN = "TESTACCESSTOKEN",
  RELAYERAUTHTOKEN = "RELAYERAUTHTOKEN",
  SMTP_HOSTNAME = "SMTP_HOSTNAME",
  SMTP_USERNAME = "SMTP_USERNAME",
  SMTP_PASSWORD = "SMTP_PASSWORD",
  SLACKFEEDBACKSURL = "SLACKFEEDBACKSURL",
  SLACKUSERSIGNUPS = "SLACKUSERSIGNUPS",
}
