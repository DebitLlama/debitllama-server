import { Handlers, PageProps } from "$fresh/server.ts";
import BuyButtonPage from "../islands/checkout/buyButtonPage.tsx";
import { State } from "./_middleware.ts";
import QueryBuilder from "../lib/backend/queryBuilder.ts";
import { signInWithPassword } from "../lib/backend/auth.ts";
import { parseEther } from "../lib/frontend/web3.ts";
import { setSupaloginCookie } from "../lib/backend/cookies.ts";
import { ItemProps } from "../lib/types/checkoutTypes.ts";
import { Head } from "$fresh/runtime.ts";

function doesProfileExists(profileData: any) {
    if (profileData === null || profileData.length === 0) {
        return false;
    }
    return true;
}
const ethEncryptPublicKey = Deno.env.get("ETHENCRYPTPUBLICKEY") || "";

export const handler: Handlers<any, State> = {
    async GET(req, ctx) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        const { data: itemData, error: itemError } = await select.Items.byButtonId(query);

        if (itemData === null || itemData.length === 0) {
            return ctx.render({ ...ctx.state, notfound: true, itemData: [] });
        }

        //isLoggedOut?
        if (!ctx.state.token) {
            return ctx.render({ ...ctx.state, notfound: false, itemData, accountData: [], profileExists: false, ethEncryptPublicKey, url })
        }

        const { data: accountData } = await select.Accounts.whereOpenByNetworkAndCurrencyAndUserId(itemData[0].network, itemData[0].currency);

        const { data: profileData } = await select.Profiles.byUserId();

        const { data: authenticators } = await select.Authenticators.allByUserId();

        return ctx.render({ ...ctx.state, notfound: false, itemData, accountData, profileExists: doesProfileExists(profileData), ethEncryptPublicKey, url, requires2Fa: authenticators.length > 0 })

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
    return <> <Head>
        <title>DebitLlama</title>
        <link rel="stylesheet" href="/styles.css" />
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
            <script src="/zxcvbn.js"></script>
            <script src="/directdebit_bundle.js"></script>
        </body> </>
}