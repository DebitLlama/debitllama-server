#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";

import "$std/dotenv/load.ts";
import config from "./fresh.config.ts";

// Remove the buggy warnings from the console. Hope Fresh fixes it soon
const origConsoleError = console.error;
console.error = (msg) => {
  if (typeof msg === "string" && msg.includes("Improper nesting of table")) {
    return;
  }
  origConsoleError(msg);
};


await dev(import.meta.url, "./main.ts", config);
