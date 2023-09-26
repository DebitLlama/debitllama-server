//This file is used to run live integration tests on the apiv1 endpoint during development!
import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { AuthenticatedGET } from "./fetch.ts";
import "$std/dotenv/load.ts";
import {
  Accounts_filterKeys,
  PaymentIntents_filterKeys,
} from "../../lib/api_v1/types.ts";
import { ChainIds } from "../../lib/shared/web3.ts";

Deno.test("api/v1/accounts pagination parameters", async () => {
  const accesstoken = Deno.env.get("TESTACCESSTOKEN") || "";

  if (accesstoken === "") {
    throw Error("Tests require a valid access token");
  }

  const filter = JSON.stringify({
    // [PaymentIntents_filterKeys.payee_address]: true,
    // [PaymentIntents_filterKeys.max_debit_amount]: true,
    // [PaymentIntents_filterKeys.debit_times]: true,
    // [PaymentIntents_filterKeys.debit_interval]: true,
    // [PaymentIntents_filterKeys.status_text]: "Created",
    // [PaymentIntents_filterKeys.pricing]: "Fixed",
    // [PaymentIntents_filterKeys.currency]: true,
    // [PaymentIntents_filterKeys.debit_item_id]: 54,
  });
  const commitment =
    "0x1e7032519f83b854fd7f61e2c802be3c60463d9f8cc59a6acd86072875d89f0e";
  const res = await AuthenticatedGET({
    url: `http://localhost:3000/api/v1/accounts/${commitment}?filter=${filter}`,
    accesstoken,
  });
  console.log(res.status);
  console.log("here");
  const json = await res.json();
  console.log(JSON.stringify(json));
});
