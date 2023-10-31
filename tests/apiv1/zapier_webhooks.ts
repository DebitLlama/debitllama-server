import "$std/dotenv/load.ts";
import { ZapierHookTypes } from "../../lib/api_v1/types.ts";
import {
  AuthenticatedDELETE,
  AuthenticatedGET,
  AuthenticatedPOST,
} from "./fetch.ts";

Deno.test("api/v1/payment_intents", async () => {
  const accesstoken = Deno.env.get("TESTACCESSTOKEN") || "";

  if (accesstoken === "") {
    throw Error("Tests require a valid access token");
  }

  let deleteIt = true;

  if (!deleteIt) {
    const res = await AuthenticatedPOST({
      url: "http://localhost:3000/api/v1/zapier",
      accesstoken,
      body: JSON.stringify({
        hookType: "SubscriptionCreated",
        hookUrl: "https://hookurl.com23",
      }),
    });

    const json = await res.json();
    console.log(json);
  } else {
    const res = await AuthenticatedDELETE({
      url: "http://localhost:3000/api/v1/zapier",
      accesstoken,
      body: JSON.stringify({
        hookType: "SubscriptionCreated",
      }),
    });

    const json = await res.json();
    console.log(json);
  }

  for (const key in ZapierHookTypes) {
    const hooktype = ZapierHookTypes[key as ZapierHookTypes];
    const res = await AuthenticatedGET({
      url: `http://localhost:3000/api/v1/zapier?hooktype=${hooktype}`,
      accesstoken,
    });
    const json = await res.json();
    console.log(
      `Requested ${hooktype}\nGot ${json.length} results\nFirst one is ${
        JSON.stringify(json[0])
      }\n\n`,
    );
  }
});
