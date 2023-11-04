import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { fetchTopUpEvent, getRelayerTopUpContract } from "../../lib/backend/web3.ts";
import RelayerUISwitcher from "../../islands/routes/RelayerUISwitcher.tsx";
import { getTotalPages, updateRelayerBalanceAndHistorySwitchNetwork } from "../../lib/backend/businessLogic.ts";
import QueryBuilder from "../../lib/backend/db/queryBuilder.ts";
import { RELAYERTOPUPHISTORYPAGESIZE, RELAYERTRANSACTIONHISTORYPAGESIZE } from "../../lib/enums.ts";
import { setProfileRedirectCookie } from "../../lib/backend/cookies.ts";
import { selectRelayerHistoryByPayeeUserIdPaginated } from "../../lib/backend/db/tables/RelayerHistory.ts";
import { selectRelayerTopUpHistoryByUserIdPaginated } from "../../lib/backend/db/tables/RelayerTopUpHistory.ts";

export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        //TODO :REFACTOR TO RPC CALLS!
        const { data: relayerBalanceDataFetched } = await select.RelayerBalance.byUserId();
        let relayerBalanceData = relayerBalanceDataFetched;
        if (relayerBalanceData === null || relayerBalanceData.length === 0) {
            const insert = queryBuilder.insert();
            // If it doesn't exist I create a new one!
            //TODO: It should insert().select(). I should select the insert and not run a select again!
            await insert.RelayerBalance.newRelayerBalance();
            const { data: relayerBalanceDataAfterInsert } = await select.RelayerBalance.byUserId();
            relayerBalanceData = relayerBalanceDataAfterInsert;
        }

        const { data: profileData } = await select.Profiles.byUserId();
        if (profileData === null || profileData.length === 0) {
            // Redirect to the profile page instead so the user needs to fill it out!
            const headers = new Headers();
            headers.set("location", "/app/profile");
            setProfileRedirectCookie(headers, "/app/relayer");
            return new Response(null, { status: 303, headers })
        }

        // Used to fetch the top up data when the user clicks on the page
        // I could move this to fetch only when the tab icon is clicked!
        const { data: relayerTopUpHistoryData, count: topupHistoryDataCount } = await selectRelayerTopUpHistoryByUserIdPaginated(ctx, {
            order: "created_at",
            ascending: false,
            rangeFrom: 0,
            rangeTo: 9
        }

        );
        const totalPagesForTopupHistory = getTotalPages(topupHistoryDataCount, RELAYERTOPUPHISTORYPAGESIZE);

        const { data: relayerTxHistoryData, count: txHistoryCount } = await selectRelayerHistoryByPayeeUserIdPaginated(ctx, {
            order: "created_at", ascending: false, rangeFrom: 0, rangeTo: RELAYERTRANSACTIONHISTORYPAGESIZE - 1
        }
        );

        const totalPagesForRelayerTxHistory = getTotalPages(txHistoryCount, RELAYERTRANSACTIONHISTORYPAGESIZE)
        return ctx.render({ ...ctx.state, relayerBalanceData, profileData, relayerTopUpHistoryData, totalPagesForTopupHistory, relayerTxHistoryData, totalPagesForRelayerTxHistory });
    },
    async POST(_req, ctx) {
        const json = await _req.json();
        const chainId = json.chainId;
        const blockNumber = json.blockNumber;
        const transactionHash = json.transactionHash;
        const from = json.from;
        const amount = json.amount;
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        // I need to decode the json sent to the server, 
        // /?TODO: RPC CALLS!
        const { data: profileData } = await select.Profiles.byUserId();
        if (profileData === null || profileData.length === 0) {
            return new Response("Invalid user Profile!", { status: 500 })
        }

        //Check if the tx is already saved into supabase I can't add it to relayer balance

        const { data: relayerTopUpHistoryData } = await select.RelayerTopUpHistory.byTransactionHash(transactionHash);

        // I need the opposite of this to occur for an error hence the !
        if (!(relayerTopUpHistoryData === null || relayerTopUpHistoryData.length === 0)) {
            return new Response("Transaction is already processed!", { status: 500, })
        }
        //fetch the event related to the transaction
        const relayerTopupContract = getRelayerTopUpContract(chainId);
        const topUpEvents = await fetchTopUpEvent(relayerTopupContract, from, amount, blockNumber);

        if (topUpEvents.length === 0) {
            //If I found no top up event, then the transaction never happened in that block!
            return new Response(null, { status: 500 })
        }

        // Check that the transaction hash from the event matches the transactionHash sent by the API
        if (topUpEvents[0].transactionHash.toLowerCase() !== transactionHash.toLowerCase()) {
            return new Response(null, { status: 500 })
        }

        await updateRelayerBalanceAndHistorySwitchNetwork(
            chainId,
            queryBuilder,
            amount,
            transactionHash
        )

        return new Response(null, { status: 200 })
    }
}



export default function Relayer(props: PageProps) {
    return <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
        <RelayerUISwitcher data={props.data}></RelayerUISwitcher>
    </Layout>
}