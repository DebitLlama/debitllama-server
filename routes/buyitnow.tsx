import { Handlers, PageProps } from "$fresh/server.ts";
import BuyButtonPage, { ItemProps } from "../islands/buyButtonPage.tsx";
import { State } from "./_middleware.ts";
import { setCookie } from "$std/http/cookie.ts";
import { ChainIds, NetworkNames, chainIdFromNetworkName } from "../lib/shared/web3.ts";

function doesProfileExists(profileData: any) {
    if (profileData === null || profileData.length === 0) {
        return false;
    }
    return true;
}

//TODO: Add a logout also!

export const handler: Handlers<any, State> = {
    async GET(req, ctx) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";

        const { data: itemData, error: itemError } = await ctx.state.supabaseClient.from("Items").select().eq("button_id", query);

        if (itemData === null || itemData.length === 0) {
            return ctx.render({ ...ctx.state, notfound: true, itemData: [] });
        }

        // I need to fetch the accounts for this user and then display the ones on the same network and currency

        const networkId = chainIdFromNetworkName[itemData[0].network as NetworkNames] as ChainIds
        const currency = JSON.parse(itemData[0].currency);
        const { data: accountData, error: accountError } = await ctx.state.supabaseClient
            .from("Accounts")
            .select()
            .eq("closed", false)
            .eq("user_id", ctx.state.userid)
            .eq("network_id", networkId)
            .eq("currency", currency.name)

        const { data: profileData, error: profileError } = await ctx.state.supabaseClient.from("Profiles").select().eq("userid", ctx.state.userid);

        return ctx.render({ ...ctx.state, notfound: false, itemData, accountData, profileExists: doesProfileExists(profileData) })
    },
    async POST(req, ctx) {
        //THIS POST IS USED FOR LOGGING IN!
        const form = await req.formData();
        const buttonId = form.get("buttonId") as string;
        const email = form.get("email") as string;
        const password = form.get("password") as string;

        const { data, error } = await ctx.state.supabaseClient.auth.signInWithPassword({ email, password });

        const headers = new Headers();

        if (data.session) {
            setCookie(headers, {
                name: 'supaLogin',
                value: data.session?.access_token,
                maxAge: data.session.expires_in
            })
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

export default function BuyItNow(props: PageProps) {
    const notfound = props.data.notfound;
    const item = props.data.itemData[0];

    const itemProps: ItemProps = {
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
        debitType: item.debitType

    }
    return <>
        {!notfound ? <BuyButtonPage

            profileExists={props.data.profileExists}
            accounts={props.data.accountData}
            url={props.url}
            item={itemProps}
            isLoggedIn={props.data.token}></BuyButtonPage> : <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
            <h1 class="text-2xl font-bold mb-6 text-center">Not Found</h1>
        </div>} </>
}