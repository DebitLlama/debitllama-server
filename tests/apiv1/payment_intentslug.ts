import {
  AuthenticatedGET,
} from "./fetch.ts";
import "$std/dotenv/load.ts";

Deno.test("GET api/v1/payment_intents/slug", async () => {
  const accesstoken = Deno.env.get("TESTACCESSTOKEN") || "";

  const res = await AuthenticatedGET({
    url:
      "https://debitllama-stage.deno.dev/api/v1/payment_intents/0x0f4d5f05dbe525279ba04ebf294e44f6c22fdd88dcfb575d1097165a1547727a?role=customer",
    accesstoken,
  });

  const json = await res.json();
  console.log(json);
});

// Deno.test("POST api/v1/payment_intents/slug", async () => {
//   const accesstoken = Deno.env.get("TESTACCESSTOKEN") || "";

//   if (accesstoken === "") {
//     throw Error("Tests require a valid access token");
//   }

//   const body = JSON.stringify({
//     requested_debit_amount: "1",
//   });

//   const res = await AuthenticatedPOST({
//     url:
//       "http://localhost:3000/api/v1/payment_intents/0x0f4d5f05dbe525279ba04ebf294e44f6c22fdd88dcfb575d1097165a1547727a",
//     body,
//     accesstoken,
//   });

//   const json1 = await res.json();
//   console.log("json1");
//   console.log(json1);
//   const id = json1.result.id;
//   const res2 = await AuthenticatedPOST({
//     url:
//       "http://localhost:3000/api/v1/payment_intents/0x0f4d5f05dbe525279ba04ebf294e44f6c22fdd88dcfb575d1097165a1547727a",
//     body: JSON.stringify({
//       cancel_request: true,
//       id,
//     }),
//     accesstoken,
//   });

//   const json2 = await res2.json();
//   console.log(json2);
// });
