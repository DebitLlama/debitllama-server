import { EMAILCONSTANTS } from "../email/types.ts";
import { sendMail } from "../email/utils/mailer.ts";
import { SalesEmailArgs } from "./kv.ts";

export async function processSalesMail(salesEmailArgs: SalesEmailArgs) {
  const SALESTEAMEMAILADDRESS = Deno.env.get("SALESTEAMEMAILADDRESS") || "";
  const content =
    `new message! name : ${salesEmailArgs.name} \nwebsite: ${salesEmailArgs.website}\nemail: ${salesEmailArgs.email}\nmessage: ${salesEmailArgs.message}`;
  const html =
    `<p>new message!<br>name:${salesEmailArgs.name}<br>website:${salesEmailArgs.website}<br>email:${salesEmailArgs.email}<br>message:${salesEmailArgs.message}</p>`;

  await sendMail({
    from: EMAILCONSTANTS.noreply,
    to: SALESTEAMEMAILADDRESS,
    subject: "Debitllama Sales",
    content,
    html,
  });
}
