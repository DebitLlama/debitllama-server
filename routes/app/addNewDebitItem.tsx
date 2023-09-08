import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import AddNewDebitItemPageForm from "../../islands/addNewDebitItemPageForm.tsx";
import { NetworkNames, chainIdFromNetworkName } from "../../lib/shared/web3.ts";
import { insertNewItem, insertNewRelayerBalance, selectProfileByUserId, selectRelayerBalanceByUserId } from "../../lib/backend/supabaseQueries.ts";



export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const headers = new Headers();

        const userid = ctx.state.userid;

        // Get the data and use it to populate the fields!
        const { data: profileData, error: profileError } = await selectProfileByUserId(ctx.state.supabaseClient, userid);

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

        const { data: profileData, error: profileError } = await selectProfileByUserId(ctx.state.supabaseClient, userid);

        if (profileData === null || profileData.length === 0) {
            headers.set("location", "/app/profile");
            return new Response(null, { status: 303, headers })
        }

        let relayerBalanceId = null;

        const { data: relayerBalanceData, error: relayerBalanceDataError } = await selectRelayerBalanceByUserId(ctx.state.supabaseClient, userid);
        // I'm gonna add the id of the relayerBalance to the debit item so I can join tables later more easily
        if (relayerBalanceData === null || relayerBalanceData.length === 0) {
            // If it doesn't exist I create a new one!
            //TODO: It should insert().select(). I should select the insert and not run a select again!
            await insertNewRelayerBalance(ctx.state.supabaseClient, userid)
            const { data: relayerBalanceData2, error: relayerBalanceDataError2 } = await selectRelayerBalanceByUserId(ctx.state.supabaseClient, userid);
            relayerBalanceId = relayerBalanceData2[0].id;
        } else {
            relayerBalanceId = relayerBalanceData[0].id
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

        await insertNewItem(
            ctx.state.supabaseClient,
            userid,
            profileData[0].walletaddress,
            currency,
            maxAmount,
            debitTimes,
            debitInterval,
            redirectto,
            pricing,
            chainIdFromNetworkName[network as NetworkNames],
            name,
            relayerBalanceId
        )

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