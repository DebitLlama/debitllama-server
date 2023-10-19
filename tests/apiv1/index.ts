//This file is used to run live integration tests on the apiv1 endpoint during development!
import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import "$std/dotenv/load.ts";
import { UnAuthenticatedGET } from "./fetch.ts";

Deno.test("api/v1 test should authenticate", async () => {
  const accesstoken = Deno.env.get("TESTACCESSTOKEN") || "";

  if (accesstoken === "") {
    throw Error("Tests require a valid access token");
  }

  const res = await UnAuthenticatedGET("http://localhost:3000/api/v1");
  // This request succeeded
  assertEquals(res.status, 200);

  const json = await res.json();
  const artifacts = json.artifacts;
  assertEquals(artifacts.length, 2);
  assertEquals(json.supported_networks.length !== 0, true);
});
