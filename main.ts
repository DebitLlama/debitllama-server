/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";
import { ethencryptInitTest, supabaseEnvVarTests } from "./tests/initTests.ts";

//Running a test on env vars so PM2 don't start this if I entered them incorrectly.
ethencryptInitTest();
supabaseEnvVarTests();

// Remove the buggy warnings from the console. Hope Fresh fixes it soon
const origConsoleError = console.error;
console.error = (msg) => {
  if (typeof msg === "string" && msg.includes("Improper nesting of table")) {
    return;
  }
  origConsoleError(msg);
};


await start(manifest, config);
