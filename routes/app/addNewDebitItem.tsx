import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import AddNewDebitItemPageForm from "../../islands/addNewDebitItemPageForm.tsx";
import { NetworkNames, chainIdFromNetworkName } from "../../lib/shared/web3.ts";



export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const headers = new Headers();

        const userid = ctx.state.userid;

        // Get the data and use it to populate the fields!
        const { data: profileData, error: profileError } = await ctx.state.supabaseClient.from("Profiles").select().eq("userid", userid);

        if (profileData === null || profileData.length === 0) {
            headers.set("location", "/app/profile");
            return new Response(null, { status: 303, headers })
        }

        return ctx.render({ ...ctx.state, creatorAddress: profileData[0].walletaddress })
    },
    async POST(_req, ctx) {
        const headers = new Headers();
        const userid = ctx.state.userid;

        const form = await _req.formData();

        const { data: profileData, error: profileError } = await ctx.state.supabaseClient.from("Profiles").select().eq("userid", userid);

        if (profileData === null || profileData.length === 0) {
            headers.set("location", "/app/profile");
            return new Response(null, { status: 303, headers })
        }
        const name = form.get("name") as string;
        const network = form.get("network") as string;
        const currency = form.get("currency") as string;
        const pricing = form.get("pricing") as string;
        const maxAmount = form.get("maxamount") as string;
        const debitTimes = form.get("debitTimes") as string;
        const debitInterval = form.get("debitInterval") as string;
        const redirectto = form.get("redirectto") as string;


        if (chainIdFromNetworkName[network as NetworkNames] === undefined) {
            headers.set("location", "/app/profile");
            return new Response(null, { status: 303, headers })
        }
        // TODO: More Input verification!!

        await ctx.state.supabaseClient.from("Items").insert({
            created_at: new Date().toISOString(),
            payee_id: userid,
            payee_address: profileData[0].walletaddress,
            currency,
            max_price: maxAmount,
            debit_times: debitTimes,
            debit_interval: debitInterval,
            redirect_url: redirectto,
            pricing,
            network: chainIdFromNetworkName[network as NetworkNames],
            name,
        })

        headers.set("location", "/app/debitItems");
        return new Response(null, { status: 303, headers })
    }
}

export default function AddNewDebitItem(props: PageProps) {
    return <Layout isLoggedIn={props.data.token}>
        <div class="container mx-auto py-8">
            <AddNewDebitItemPageForm creatorAddress={props.data.creatorAddress}></AddNewDebitItemPageForm>
        </div>
    </Layout>
}