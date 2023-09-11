import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import AddNewDebitItemPageForm from "../../islands/addNewDebitItemPageForm.tsx";
import { NetworkNames, chainIdFromNetworkName, getCurrenciesForNetworkName } from "../../lib/shared/web3.ts";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import { Pricing } from "../../lib/enums.ts";
import { errorResponseBuilder } from "../../lib/backend/responseBuilders.ts";



export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const headers = new Headers();
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        // Get the data and use it to populate the fields!
        const { data: profileData } = await select.Profiles.byUserId();

        if (profileData === null || profileData.length === 0) {
            headers.set("location", "/app/profile");
            return new Response(null, { status: 303, headers })
        }

        return ctx.render({ ...ctx.state, creatorAddress: profileData[0].walletaddress })
    },
    async POST(_req, ctx) {

        const headers = new Headers();
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        const insert = queryBuilder.insert();
        const form = await _req.formData();

        const { data: profileData } = await select.Profiles.byUserId();

        if (profileData === null || profileData.length === 0) {
            headers.set("location", "/app/profile");
            return new Response(null, { status: 303, headers })
        }

        let relayerBalanceId = null;

        const { data: relayerBalanceData } = await select.RelayerBalance.byUserId();
        // I'm gonna add the id of the relayerBalance to the debit item so I can join tables later more easily
        if (relayerBalanceData === null || relayerBalanceData.length === 0) {
            await insert.RelayerBalance.newRelayerBalance()
            const { data: relayerBalanceData2, error: relayerBalanceDataError2 } = await select.RelayerBalance.byUserId();
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

        if (isNaN(parseInt(debitTimes))) {
            return errorResponseBuilder("Invalid Debit Time!")
        }


        if (pricing === Pricing.Fixed && Number(debitInterval) < 1) {
            return errorResponseBuilder("Invalid Debit Interval! Fixed payments can't have unspecified interval!")
        }

        if (isNaN(parseFloat(maxAmount))) {
            return errorResponseBuilder("Invalid maxAmount!")
        }

        if (isNaN(parseInt(debitInterval))) {
            return errorResponseBuilder("Invalid interval!")
        }

        if (pricing !== Pricing.Fixed && pricing !== Pricing.Dynamic) {
            return errorResponseBuilder("Invalid pricing");
        }

        try {
            const parsedCurrency = JSON.parse(currency);

            const name = parsedCurrency.name;
            const native = parsedCurrency.native;
            const contractAddress = parsedCurrency.contractAddress;

            const chainCurrencies = getCurrenciesForNetworkName[network as NetworkNames];

            const findSubmittedCurrency = chainCurrencies.filter((curr) => curr.name === name && curr.native === native && curr.contractAddress === contractAddress);
            if (findSubmittedCurrency.length !== 1) {
                throw new Error();
            }

        } catch (err) {
            return errorResponseBuilder("Unable to parse currency!");
        }

        if (!isValidUrl(redirectto)) {
            return errorResponseBuilder("Invalid redirect to URL!")
        }

        const { data: item } = await insert.Items.newItem(
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

        headers.set("location", `/app/item?q=${item[0].button_id}`);

        return new Response(null, { status: 303, headers })
    }
}

const isValidUrl = (urlString: string) => {
    try {
        return Boolean(new URL(urlString));
    }
    catch (e) {
        return false;
    }
}

export default function AddNewDebitItem(props: PageProps) {
    return <Layout isLoggedIn={props.data.token}>
        <div class="container mx-auto py-8">
            <AddNewDebitItemPageForm creatorAddress={props.data.creatorAddress}></AddNewDebitItemPageForm>
        </div>
    </Layout>
}