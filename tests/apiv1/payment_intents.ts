import "$std/dotenv/load.ts";
import { PaymentIntents_filterKeys } from "../../lib/api_v1/types.ts";
import { UnAuthenticatedGET } from "./fetch.ts";

Deno.test("api/v1/payment_intents", async () => {
  const accesstoken = Deno.env.get("TESTACCESSTOKEN") || "";

  if (accesstoken === "") {
    throw Error("Tests require a valid access token");
  }

  const filter = JSON.stringify({
    [PaymentIntents_filterKeys.pricing]: "Dynamic",
    [PaymentIntents_filterKeys.status_text]: "Created"
  });

  const res = await UnAuthenticatedGET(
    "http://localhost:3000/api/v1/payment_intents?current_page=0&page_size=20&sort_by=pricing&sort_direction=DESC&filter=" +
      filter,
  );

  const json = await res.json();
  console.log(json);
});
