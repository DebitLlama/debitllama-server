import "$std/dotenv/load.ts";
import { AuthenticatedDELETE, AuthenticatedPOST } from "./fetch.ts";

Deno.test("api/v1/payment_intents", async () => {
  const accesstoken = Deno.env.get("TESTACCESSTOKEN") || "";

  if (accesstoken === "") {
    throw Error("Tests require a valid access token");
  }

  let deleteIt = true;

  if (!deleteIt) {
    const res = await AuthenticatedPOST({
      url: "http://localhost:3000/api/v1/zapier/webhooks",
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
      url: "http://localhost:3000/api/v1/zapier/webhooks",
      accesstoken,
      body: JSON.stringify({
        hookType: "SubscriptionCreated",
      }),
    });

    const json = await res.json();
    console.log(json);
  }
});