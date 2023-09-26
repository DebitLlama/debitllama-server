import { AuthenticatedGET } from "./fetch.ts";
import "$std/dotenv/load.ts";

Deno.test("api/v1/payment_intents", async () => {
  const accesstoken = Deno.env.get("TESTACCESSTOKEN") || "";

  if (accesstoken === "") {
    throw Error("Tests require a valid access token");
  }

  const res = await AuthenticatedGET({
    url:
      "http://localhost:3000/api/v1/payment_intents?current_page=0&page_size=2&sort_by=pricing&sort_direction=DESC",
    accesstoken,
  });

  const json = await res.json();
  console.log(json);
});
