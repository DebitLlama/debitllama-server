import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import BuyPageLayout from "../../components/BuyPageLayout.tsx";
import { getItemProps } from "../buyitnow.tsx";
import { formatEther, getAccount, getEncryptedNote, parseEther } from "../../lib/backend/web3.ts";
import { decryptData } from "../../lib/backend/decryption.ts";
import ApprovePaymentIsland from "../../islands/approvePaymentIsland.tsx";
import QueryBuilder from "../../lib/backend/db/queryBuilder.ts";
import { AccountAccess, AccountTypes } from "../../lib/enums.ts";
import { verifyAuthentication } from "../../lib/webauthn/backend.ts";
import { Head } from "$fresh/runtime.ts";

const ethEncryptPrivateKey = Deno.env.get("ETHENCRYPTPRIVATEKEY") || "";


export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const debititem_buttonId = form.get("debititem") as string;
    const accountcommitment = form.get("accountcommitment") as string;
    const userid = ctx.state.userid;
    const queryBuilder = new QueryBuilder(ctx);
    const select = queryBuilder.select();

    // Check if the 2fa is activated and it it is, then require the challenge data in the request!

    const { data: authenticators } = await select.Authenticators.allByUserId();

    if (authenticators.length !== 0) {
      // 2Fa is required, the requiest must have sent the signed challenge!
      const verificationOptions = form.get("verificationOptions") as string;
      const { data: userChallenge } = await select.UserChallenges
        .currentChallenge();

      const [success, verification] = await verifyAuthentication(
        JSON.parse(verificationOptions),
        userChallenge[0],
        authenticators[0],
      );
      // If the verification is successful then continue to the approve payment page, 
      // if the verification is not successful, maybe I can navigate back to the item page with an error

      if (!success || !verification.verified) {
        const headers = new Headers();
        const redirect = `/buyitnow?q=${debititem_buttonId}&error=Passkey Authentication Failed!`
        headers.set("location", redirect);
        return new Response(null, {
          status: 303,
          headers
        });
      }
    }

    //TODO: RPC CALL!!

    const { data: itemData } = await select.Items.byButtonId(debititem_buttonId);

    if (itemData === null || itemData.length === 0) {
      return ctx.render({ ...ctx.state, notfound: true, itemData: [] });
    }

    const { data: accountdata } = await select.Accounts.byCommitment(accountcommitment);

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

    const onChainAccount = await getAccount(accountcommitment, accountNetwork, accountdata[0].accountType);
    if (!onChainAccount.exists) {
      return ctx.render({ ...ctx.state, notfound: true, itemData: [] });
    }

    if (
      parseEther(accountdata[0].balance) !== onChainAccount.account[3] &&
      accountdata[0].accountType !== AccountTypes.CONNECTEDWALLET
    ) {
      //This don't need to run when the account type is ConnectedWallet!
      const update = queryBuilder.update();

      await update.Accounts.balanceAndClosedById(
        onChainAccount.account[3],
        !onChainAccount.account[0],
        accountdata[0].id);
    }

    const encryptedNote = await getEncryptedNote(accountcommitment, accountNetwork, accountdata[0].accountType);

    //Decrypt the encrypted note only if the account_access is password
    const cipherNote = accountdata[0].account_access === AccountAccess.password ? await decryptData(ethEncryptPrivateKey, encryptedNote) : encryptedNote;


    const resp = await ctx.render(
      {
        ...ctx.state,
        chainId: itemNetwork,
        notfound: false,
        itemData: itemData,
        cipherNote,
        accountcommitment,
        accountName: accountdata[0].name,
        accountBalance: formatEther(onChainAccount.account.balance),
        accountCurrency: accountdata[0].currency,
        accountType: accountdata[0].accountType,
        account_access: accountdata[0].account_access,
        closed: accountdata[0].closed,
      });

    resp.headers.set("Cache-control", "no-cache, no-store, must-revalidate");
    resp.headers.set("Pragma", "no-cache");
    resp.headers.set("Expires", "0");

    return resp;
  },
  GET(req: any, ctx: any) {
    return new Response(null, { status: 500 })
  }
};

export default function Approvepayments(props: PageProps) {
  const notfound = props.data.notfound;
  const item = props.data.itemData[0];
  return <>
    <html lang="en">
      <Head>
        <title>DebitLlama</title>
        <link rel="stylesheet" href="/styles.css" />
        <meta name="description" content="DebitLlama - Subscription Payments" />
      </Head>
      <body>
        {!notfound ? <BuyPageLayout
          isLoggedIn={props.data.token}
          item={getItemProps(item)}
        >
          <ApprovePaymentIsland
            chainId={props.data.chainId}
            cipherNote={props.data.cipherNote}
            itemData={getItemProps(item)}
            accountcommitment={props.data.accountcommitment}
            accountName={props.data.accountName}
            accountBalance={props.data.accountBalance}
            accountCurrency={props.data.accountCurrency}
            accountType={props.data.accountType}
            account_access={props.data.account_access}
            closed={props.data.closed}
          ></ApprovePaymentIsland>
        </BuyPageLayout> : <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
          <h1 class="text-2xl font-bold mb-6 text-center">Not Found</h1>
        </div>
        }
        <script src="/zxcvbn.js" defer></script>
        <script src="/directdebit_bundle.js" defer></script>
      </body>
    </html>
  </>
}
