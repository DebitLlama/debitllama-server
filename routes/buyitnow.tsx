import { Handlers, PageProps } from "$fresh/server.ts";
import BuyButtonPage from "../islands/checkout/buyButtonPage.tsx";
import { State } from "./_middleware.ts";
import QueryBuilder from "../lib/backend/db/queryBuilder.ts";
import { signInWithPassword } from "../lib/backend/db/auth.ts";
import { parseEther } from "../lib/frontend/web3.ts";
import { setSupaloginCookie } from "../lib/backend/cookies.ts";
import { ItemProps } from "../lib/types/checkoutTypes.ts";
import { Head } from "$fresh/runtime.ts";
import { selectBuyitnowAccounts } from "../lib/backend/db/rpc.ts";

const ethEncryptPublicKey = Deno.env.get("ETHENCRYPTPUBLICKEY") || "";

export const handler: Handlers<any, State> = {
    async GET(req, ctx) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        const queryBuilder = new QueryBuilder(ctx);
        const { data: itemData } = await queryBuilder.select().Items.byButtonId(query);

        if (itemData === null || itemData.length === 0) {
            return ctx.render({ ...ctx.state, notfound: true, itemData: [] });
        }

        if (!ctx.state.token) {
            return ctx.render({ ...ctx.state, notfound: false, itemData, accountData: [], profileExists: false, ethEncryptPublicKey, url })
        }

        const rpcRes = await selectBuyitnowAccounts(ctx,
            {
                networkId: itemData[0].network,
                currency: itemData[0].currency,
                button_id: query
            })

        return ctx.render(
            {
                ...ctx.state,
                notfound: false,
                itemData,
                accountData: rpcRes.data.accountData,
                profileExists: rpcRes.data.isProfileSet,
                ethEncryptPublicKey,
                url,
                requires2Fa: rpcRes.data.isAuthenticatorsSet
            })

    },
    async POST(req, ctx) {
        //THIS POST IS USED FOR LOGGING IN!
        const form = await req.formData();
        const buttonId = form.get("buttonId") as string;
        const email = form.get("email") as string;
        const password = form.get("password") as string;

        const { data, error } = await signInWithPassword(ctx.state.supabaseClient, email, password);

        const headers = new Headers();

        if (data.session) {
            setSupaloginCookie(
                headers,
                data.session?.access_token,
                data.session.expires_in);
        }

        let redirect = "buyitnow?q=" + buttonId;

        if (error) {
            redirect = `${redirect}&error=${error.message}`
        }

        headers.set("location", redirect);
        return new Response(null, {
            status: 303,
            headers,
        });
    }

}

export function getItemProps(item: any): ItemProps {
    return {
        payeeAddress: item.payee_address,
        currency: JSON.parse(item.currency),
        maxPrice: item.max_price,
        debitTimes: item.debit_times,
        debitInterval: item.debit_interval,
        buttonId: item.button_id,
        redirectUrl: item.redirect_url,
        pricing: item.pricing,
        network: item.network,
        name: item.name,

    };
}
function sortAccounts(accounts: Array<any> | null): Array<any> | null {
    if (accounts === null) {
        return [];
    }
    return accounts.sort((a, b) => {
        const abalance = parseEther(a.balance);
        const bbalance = parseEther(b.balance);
        if (abalance > bbalance) {
            return -1;
        }
        if (abalance < bbalance) {
            return 1;
        }
        return 0;
    })
}


export default function BuyItNow(props: PageProps) {
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
                {!notfound ? <BuyButtonPage
                    ethEncryptPublicKey={props.data.ethEncryptPublicKey}
                    profileExists={props.data.profileExists}
                    accounts={sortAccounts(props.data.accountData)}
                    url={props.url.toString()}
                    item={getItemProps(item)}
                    isLoggedIn={props.data.token}
                    requires2Fa={props.data.requires2Fa}
                ></BuyButtonPage> : <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
                    <h1 class="text-2xl font-bold mb-6 text-center">Not Found</h1>
                </div>}
                <script defer src="/zxcvbn.js" ></script>
                <script defer src="/directdebit_bundle.js"></script>
            </body>
        </html>
    </>
}