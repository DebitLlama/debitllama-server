import "$std/dotenv/load.ts";
import { AuthenticatedGET, AuthenticatedPOST } from "./fetch.ts";

Deno.test("api/v1/items", async () => {
  const accesstoken = Deno.env.get("TESTACCESSTOKEN") || "";

  if (accesstoken === "") {
    throw Error("Tests require a valid access token");
  }

  // fetch items and todo:..

  //   const filter = JSON.stringify({
  //     [PaymentIntents_filterKeys.pricing]: "Dynamic",
  //     [PaymentIntents_filterKeys.status_text]: "Created"
  //   });

  const res = await AuthenticatedGET({
    accesstoken,
    url: "http://localhost:3000/api/v1/items",
  });

  const json = await res.json();
  console.log(json);
});

Deno.test("api/v1/items POST", async () => {
  const accesstoken = Deno.env.get("TESTACCESSTOKEN") || "";

  if (accesstoken === "") {
    throw Error("Tests require a valid access token");
  }

  const name = "testitemname",
    chainId = "0x405",
    walletaddress = "0xD97F13b8fd8a54434F7Bd7981F0D6C82EA1b59F3",
    currency = JSON.stringify({
      name: "BTT",
      native: true,
      contractAddress: "",
    }),
    pricing = "Fixed",
    maxAmount = "5000",
    debitTimes = "1",
    debitInterval = "1",
    redirectto = "https://asd.com";

  const res = await AuthenticatedPOST({
    accesstoken,
    url: "http://localhost:3000/api/v1/items",
    body: JSON.stringify({
      name,
      chainId,
      walletaddress,
      currency,
      pricing,
      maxAmount,
      debitTimes,
      debitInterval,
      redirectto,
    }),
  });

  const { item_id } = await res.json();

  console.log("ITEM ID: ", item_id);


  const GETRes = await AuthenticatedGET({
    accesstoken,
    url: `http://localhost:3000/api/v1/items/${item_id}`,
  });

  const getresp = await GETRes.json();
  const item = getresp.item;
  const { deleted, redirect_url } = item;
  console.log(deleted, redirect_url);

  const disablePOSTRes = await AuthenticatedPOST({
    accesstoken,
    url: `http://localhost:3000/api/v1/items/${item_id}`,
    body: JSON.stringify({ type: "disable", value: true }),
  });

  console.log(await disablePOSTRes.json());

  const redirectUrlPostRes = await AuthenticatedPOST({
    accesstoken,
    url: `http://localhost:3000/api/v1/items/${item_id}`,
    body: JSON.stringify({ type: "redirect", value: "https://asfasf.com" }),
  });

  console.log(await redirectUrlPostRes.json());
});
