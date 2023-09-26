//This file is used to run live integration tests on the apiv1 endpoint during development!
import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { UnAuthenticatedGET } from "./fetch.ts";
import "$std/dotenv/load.ts";
import { Accounts_filterKeys } from "../../lib/api_v1/types.ts";
import { ChainIds } from "../../lib/shared/web3.ts";

Deno.test("api/v1/accounts test should fail if the query parameters are malformed", async () => {
  const accesstoken = Deno.env.get("TESTACCESSTOKEN") || "";

  if (accesstoken === "") {
    throw Error("Tests require a valid access token");
  }

  let res = await UnAuthenticatedGET(
    "http://localhost:3000/api/v1/accounts?current_page=asd",
  );
  assertEquals(res.status, 400);
  let json = await res.json();
  assertEquals(
    json.error.message,
    "Invalid current_page parameter. Must be integer",
  );

  res = await UnAuthenticatedGET(
    "http://localhost:3000/api/v1/accounts?page_size=asd",
  );
  assertEquals(res.status, 400);
  json = await res.json();

  assertEquals(
    json.error.message,
    "Invalid page_size parameter. Must be integer",
  );

  res = await UnAuthenticatedGET(
    "http://localhost:3000/api/v1/accounts?sort_direction=asd",
  );
  assertEquals(res.status, 400);
  json = await res.json();

  assertEquals(
    json.error.message,
    "Invalid sort_direction. Must be ASC or DESC",
  );

  res = await UnAuthenticatedGET(
    "http://localhost:3000/api/v1/accounts?sort_by=asd",
  );
  assertEquals(res.status, 400);
  json = await res.json();

  assertEquals(
    json.error.message,
    "Invalid SortBy parameter! Column not found",
  );
});

Deno.test("api/v1/accounts should return accounts!", async () => {
  const accesstoken = Deno.env.get("TESTACCESSTOKEN") || "";

  if (accesstoken === "") {
    throw Error("Tests require a valid access token");
  }

  const res = await UnAuthenticatedGET(
    "http://localhost:3000/api/v1/accounts",
  );

  const json = await res.json();
  assertEquals(res.status, 200);
});

Deno.test("api/v1/accounts should filter!", async () => {
  const accesstoken = Deno.env.get("TESTACCESSTOKEN") || "";

  if (accesstoken === "") {
    throw Error("Tests require a valid access token");
  }

  const filter = JSON.stringify({
    [Accounts_filterKeys.name]: "",
    [Accounts_filterKeys.network_id]: ChainIds.BTT_TESTNET_ID,
    [Accounts_filterKeys.creator_address]:
      "0x2beE8f1a64A0a2dFbf105114B6B092b5636bC552",
    [Accounts_filterKeys.currency]:
      `{"name":"USDTM","native":false,"contractAddress":"0x4420a4415033bd22393d3A918EF8d2c9c62efD99"}`,
    [Accounts_filterKeys.closed]: true,
    // [Accounts_filterKeys.balance]: "",
    [Accounts_filterKeys.account_type]: "CONNECTEDWALLET",
  });
  const res = await UnAuthenticatedGET(
    "http://localhost:3000/api/v1/accounts?filter=" + filter,
  );

  const json = await res.json();
  assertEquals(res.status, 200);
  console.log(json);
});

Deno.test("api/v1/accounts pagination parameters", async () => {
  const accesstoken = Deno.env.get("TESTACCESSTOKEN") || "";

  if (accesstoken === "") {
    throw Error("Tests require a valid access token");
  }

  const res = await UnAuthenticatedGET(
    "http://localhost:3000/api/v1/accounts?current_page=3&page_size=2&sort_by=name&sort_direction=DESC",
  );
  // console.log(res);
  const json = await res.json();
  // console.log(json);
  // for (let i = 0; i < json.accounts.length; i++) {
  //   console.log(json.accounts[i].name);
  // }
});
