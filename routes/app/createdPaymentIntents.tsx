import Layout from "../../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { selectPaymentIntentByPaymentIntentAndCreatorUserId, selectRelayerHistoryById, updatePaymentItemStatus } from "../../lib/backend/supabaseQueries.ts";
import { RenderIdentifier, Tooltip, UnderlinedTd, getDebitIntervalText, getSubscriptionTooltipMessage } from "../../components/components.tsx";
import { PaymentIntentRow, PaymentIntentStatus } from "../../lib/enums.ts";
import { getStatusLogo } from "../../components/PaymentIntentsTable.tsx";
import RelayedTxHistory from "../../islands/RelayedTxHistory.tsx";
import CancelPaymentIntentButton from "../../islands/CancelPaymentIntentButton.tsx";
import { ChainIds, rpcUrl } from "../../lib/shared/web3.ts";
import { getPaymentIntentHistory } from "../../lib/backend/web3.ts";

export const handler: Handlers<any, State> = {
    async GET(req: any, ctx: any) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        const { data: paymentIntentData, error: paymentIntentError } = await selectPaymentIntentByPaymentIntentAndCreatorUserId(
            ctx.state.supabaseClient, query, ctx.state.userid);

        if (paymentIntentData === null || paymentIntentData.length === 0) {
            return ctx.render({ ...ctx.state, notfound: true });
        }

        const { data: paymentIntentHistory, error: paymentIntentHistoryError } = await selectRelayerHistoryById(
            ctx.state.supabaseClient,
            paymentIntentData[0].id
        );

        return ctx.render({ ...ctx.state, notfound: false, paymentIntentData, paymentIntentHistory });
    },
    async POST(req: any, ctx: any) {
        const json = await req.json();
        const paymentIntent = json.paymentIntent;
        const chainId = json.chainId;
        const networkExists = rpcUrl[chainId as ChainIds]
        if (!networkExists) {
            return new Response(null, { status: 500 })
        }

        const paymentIntentHistory = await getPaymentIntentHistory(chainId, paymentIntent);
        if (paymentIntentHistory.isNullified) {
            // Update the database if it's nullified
            // set the payment intent to closed!
            await updatePaymentItemStatus(ctx.state.supabaseClient, PaymentIntentStatus.CANCELLED, paymentIntent);
            return new Response(null, { status: 200 })
        } else {
            return new Response(null, { status: 500 })
        }

    }
}


export default function CreatedPaymentIntents(props: PageProps) {
    const pi = props.data.paymentIntentData[0] as PaymentIntentRow;
    return <Layout isLoggedIn={props.data.token}>
        <div class="container mx-auto">
            {!props.data.notfound ? <div>
                <div class="text-center"><h1 class="text-2xl font-bold mb-2">Payment Intent</h1></div>
                <div class="flex rounded-xl" style="background-color:white;">
                    <table class="table-fixed w-full  border border-gray-200 dark:border-gray-700 md:rounded-lg">
                        <thead>
                            <tr> <th class={"w-1/4"}></th>
                                <th class="w-1/2"></th>
                                <th class="w-1/6"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200  text-sm" >Name:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p>{pi.debit_item_id.name}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The name of subscription"></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm" >Status:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {getStatusLogo(pi.statusText)}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The current status of the payment"></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm" >Identifier:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {RenderIdentifier(pi.paymentIntent)}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The unique identifier of the payment intent"></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm" >Approved Payment:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {pi.debit_item_id.max_price} {JSON.parse(pi.debit_item_id.currency).name} </p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The maximum amount that can be debited from the account"></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Network:</UnderlinedTd>
                                <UnderlinedTd extraStyles="" ><p>{pi.debit_item_id.network}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The network used for this payment"></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Pricing:</UnderlinedTd>
                                <UnderlinedTd extraStyles="" ><p> {pi.debit_item_id.pricing}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message={getSubscriptionTooltipMessage(pi.debit_item_id.pricing)}></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm" >Debit Times:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {pi.debit_item_id.debit_times} payment{pi.debit_item_id.debit_times === 1 ? "" : "s"}</p> </UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The amount of times this approval lets the payee debit the account"></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Debit Interval (Days):</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {getDebitIntervalText(pi.debit_item_id.debit_interval, pi.debit_item_id.debit_times)}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The amount of days that needs to pass before the account can be debited again, counted from the last payment date"></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Transaction Count:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {pi.used_for}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The amount of times the payment intent was used!"></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Transactions Left:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {pi.debit_item_id.debit_times - pi.used_for}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The amount of transactions left with this payment intent!"></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Last Payment Date:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {pi.lastPaymentDate === null ? "" : new Date(pi.lastPaymentDate).toLocaleString()}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The last time this payment intent was used."></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Next Payment Date:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {pi.nextPaymentDate === null ? "" : new Date(pi.nextPaymentDate).toLocaleString()}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The approximate time when the next payment intent will become valid."></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Account Balance:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p>{pi.account_id.balance}  {JSON.parse(pi.debit_item_id.currency).name}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The current balance of the account that will be charged."></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Cancel Payment Intent:</UnderlinedTd>
                                <UnderlinedTd extraStyles="">
                                    <CancelPaymentIntentButton chainId={pi.network as ChainIds} paymentIntent={pi} transactionsLeft={pi.debit_item_id.debit_times - pi.used_for}></CancelPaymentIntentButton>
                                </UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="Only the payee or the wallet that created the account can cancel the payment. You need to sign a transaction."></Tooltip></UnderlinedTd>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <RelayedTxHistory paymentIntentHistory={props.data.paymentIntentHistory}></RelayedTxHistory>

            </div> : <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
                <h1 class="text-2xl font-bold mb-6 text-center">Not Found</h1>
            </div>}
        </div>
    </Layout>
}