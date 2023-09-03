import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import BuyPageLayout from "../../components/BuyPageLayout.tsx";
import { getItemProps } from "../buyitnow.tsx";
import { getAccount, getEncryptedNote } from "../../lib/backend/web3.ts";
import { decryptData } from "../../lib/backend/decryption.ts";
import ApprovePaymentIsland from "../../islands/approvePaymentIsland.tsx";

const ethEncryptPrivateKey = Deno.env.get("ETHENCRYPTPRIVATEKEY") || "";


export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const debititem_buttonId = form.get("debititem");
    const accountcommitment = form.get("accountcommitment") as string;
    const userid = ctx.state.userid;

    const { data: itemData, error: itemError } = await ctx.state.supabaseClient.from("Items").select().eq("button_id", debititem_buttonId);

    if (itemData === null || itemData.length === 0) {
      return ctx.render({ ...ctx.state, notfound: true, itemData: [] });
    }

    const { data: accountdata, error: accountError } = await ctx.state.supabaseClient.from("Accounts").select().eq("commitment", accountcommitment);

    if (accountdata === null || accountcommitment === null) {

      return ctx.render({ ...ctx.state, notfound: true, itemData: [] })
    }


    if (accountdata[0].user_id !== userid) {

      return ctx.render({ ...ctx.state, notfound: true, itemData: [] })
    }

    const itemNetwork = itemData[0].network;
    const accountNetwork = accountdata[0].network_id;
    if (itemNetwork !== accountNetwork) {
      return ctx.render({ ...ctx.state, notfound: true, itemData: [] });
    }

    const account = await getAccount(accountcommitment, accountNetwork);
    if (!account.exists) {
      return ctx.render({ ...ctx.state, notfound: true, itemData: [] });
    }

    const encryptedNote = await getEncryptedNote(accountcommitment, accountNetwork);

    //Decrypt the encrypted note

    const symmetricEncryptedNote = await decryptData(ethEncryptPrivateKey, encryptedNote);
    const resp = await ctx.render(
      {
        ...ctx.state,
        notfound: false,
        itemData: itemData,
        symmetricEncryptedNote,
        accountcommitment,
        accountName: accountdata[0].name,
        accountBalance: accountdata[0].balance,
        accountCurrency: accountdata[0].currency
      });

    resp.headers.set("Cache-control", "no-cache, no-store, must-revalidate");
    resp.headers.set("Pragma", "no-cache");
    resp.headers.set("Expires", "0");

    return resp;
  },
  async GET(req: any, ctx: any) {
    return new Response(null, { status: 500 })
  }
};

export default function Approvepayments(props: PageProps) {
  const notfound = props.data.notfound;
  const item = props.data.itemData[0];
  return <>{!notfound ? <BuyPageLayout
    isLoggedIn={props.data.token}
    item={getItemProps(item)}

  >
    <ApprovePaymentIsland
      symmetricEncryptedNote={props.data.symmetricEncryptedNote}
      itemData={getItemProps(item)}
      accountcommitment={props.data.accountcommitment}
      accountName={props.data.accountName}
      accountBalance={props.data.accountBalance}
      accountCurrency={props.data.accountCurrency}
    ></ApprovePaymentIsland>
  </BuyPageLayout> : <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
    <h1 class="text-2xl font-bold mb-6 text-center">Not Found</h1>
  </div>
  }
  </>
}
