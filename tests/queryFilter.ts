import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import {
  fetchTopUpEvent,
  getRelayerTopUpContract,
} from "../lib/backend/web3.ts";

async function main() {
  const relayerTopupContract = getRelayerTopUpContract("0x405");
  const TopUpEvents = await fetchTopUpEvent(
    relayerTopupContract,
    "0x2beE8f1a64A0a2dFbf105114B6B092b5636bC552",
    "10",
    26856596,
  ).catch((err) => {
    console.log("error occured");
  });

  console.log(TopUpEvents);
}

await main();
