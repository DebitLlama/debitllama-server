import Layout from "../../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { NotFound, Tooltip, UnderlinedTd, getDebitIntervalText, getPaymentIntentStatusLogo, getPaymentIntentStatusTooltip, getSubscriptionTooltipMessage } from "../../components/components.tsx";
import { AccountTypes, PaymentIntentRow, PaymentIntentStatus, RELAYERTRANSACTIONHISTORYPAGESIZE } from "../../lib/enums.ts";
import RelayedTxHistory from "../../islands/pagination/RelayedTxHistoryWithPagination.tsx";
import CancelPaymentIntentButton from "../../islands/CancelPaymentIntentButton.tsx";
import { ChainIds, networkNameFromId, rpcUrl } from "../../lib/shared/web3.ts";
import { getPaymentIntentHistory } from "../../lib/backend/web3.ts";
import QueryBuilder from "../../lib/backend/db/queryBuilder.ts";
import { selectRelayerHistoryByPaymentIntentIdPaginated } from "../../lib/backend/db/tables/RelayerHistory.ts";
import { enqueueWebhookWork } from "../../lib/backend/queue/kv.ts";
import { EventType } from "../../lib/backend/email/types.ts";

export const handler: Handlers<any, State> = {
    async GET(req: any, ctx: any) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();

        //TODO: THESE 2 CAN BE 1 RPC CALL!
        const { data: paymentIntentData } = await select.PaymentIntents.byPaymentIntentAndUserIdForCreator(query);

        if (paymentIntentData === null || paymentIntentData.length === 0) {
            return ctx.render({ ...ctx.state, notfound: true });
        }

        const { data: paymentIntentHistory, count: paymentIntentHistoryTotalpages } = await selectRelayerHistoryByPaymentIntentIdPaginated(ctx, {
            paymentIntentid: paymentIntentData[0].id,
            order: "created_at",
            ascending: false,
            rangeFrom: 0, rangeTo: RELAYERTRANSACTIONHISTORYPAGESIZE - 1
        }
        );

        return ctx.render({ ...ctx.state, notfound: false, paymentIntentData, paymentIntentHistory, paymentIntentHistoryTotalpages });
    },
    async POST(req: any, ctx: any) {
        try {
            const json = await req.json();
            const paymentIntent = json.paymentIntent;
            const chainId = json.chainId;
            const networkExists = rpcUrl[chainId as ChainIds];

            const accountType = json.accountType as AccountTypes;
            if (!networkExists) {
                return new Response(null, { status: 500 })
            }
            const paymentIntentHistory = await getPaymentIntentHistory(chainId, paymentIntent, accountType);
            if (paymentIntentHistory.isNullified) {
                const queryBuilder = new QueryBuilder(ctx);
                const update = queryBuilder.update();
                // Update the database if it's nullified
                // set the payment intent to closed!
                await update.PaymentIntents.statusByPaymentIntent(PaymentIntentStatus.CANCELLED, paymentIntent).then(async () => {
                    enqueueWebhookWork({
                        eventType: EventType.SubscriptionCancelled,
                        paymentIntent: paymentIntent,
                    })
                });
                return new Response(null, { status: 200 })
            } else {
                return new Response(null, { status: 500 })
            }
        } catch (err: any) {
            return new Response(null, { status: 500 })
        }
    }
}

export default function CreatedPaymentIntents(props: PageProps) {

    if (props.data.notfound) {
        return <NotFound title="🔎">
            <p class="text-center">Your subscriptions will be displayed here.</p>
            <div class="flex flex-row text-center">
                <a
                    class="mx-auto bg-gradient-to-b w-max text-gray-500 font-semibold from-slate-50 to-gray-100 px-10 py-3 rounded-2xl shadow-gray-400 shadow-md border-b-4 hover border-b border-gray-200 hover:shadow-sm transition-all duration-500"
                    href="/app/subscriptions">Go to subscriptions</a>
            </div>
        </NotFound>
    }

    const pi = props.data.paymentIntentData[0] as PaymentIntentRow;
    return <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
        <div class="container mx-auto py-8">
            <div class="bg-gray-100 border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <div class="text-center"><h1 class="text-2xl font-bold mb-2 text-gray-500 ">Subscription</h1></div>
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
                                <UnderlinedTd extraStyles="">{getPaymentIntentStatusLogo(pi.statusText, "account")}</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message={getPaymentIntentStatusTooltip(pi.statusText, "account")}></Tooltip></UnderlinedTd>
                            </tr>

                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm" >Approved Payment:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {pi.debit_item_id.max_price} {JSON.parse(pi.debit_item_id.currency).name} </p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The maximum amount that can be debited from the account"></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">My Account Balance:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p>{pi.account_id.balance}  {JSON.parse(pi.debit_item_id.currency).name}</p>
                                    <a class="text-indigo-500 hover:text-indigo-800" href={`/app/account?q=${pi.account_id.commitment}`}>Top Up</a></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The current balance of the account that will be charged."></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Network:</UnderlinedTd>
                                <UnderlinedTd extraStyles="" ><p>{networkNameFromId[pi.debit_item_id.network as ChainIds]}</p></UnderlinedTd>
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
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Transactions:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {pi.used_for} / {pi.debitTimes}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="You can tell see how many payments have been completed per total payments. The next payment will be processed after the next payment date!"></Tooltip></UnderlinedTd>
                            </tr>

                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Last Payment Date:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {pi.lastPaymentDate === null ? "Waiting for first payment" : new Date(pi.lastPaymentDate).toLocaleString()}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The last payment date is the time when the last transaction was submitted to the network to complete the payment."></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Next Payment Date:</UnderlinedTd>
                                <UnderlinedTd extraStyles="">
                                    {pi.debitTimes - pi.used_for === 0 ? <p>Payments complete</p> :
                                        <p>{pi.nextPaymentDate === null ? "" : new Date(pi.nextPaymentDate).toLocaleString()}</p>
                                    }
                                </UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The approximate time when the next payment intent will become valid."></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm" >Identifier:</UnderlinedTd>
                                <UnderlinedTd extraStyles="truncate"><pre> {pi.paymentIntent}</pre></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="Your subscriptions unique identifier. You can use this with the search on the subscriptions page and send it to the payee if you need them to identify your subscription."></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Cancel Payment Intent:</UnderlinedTd>
                                <UnderlinedTd extraStyles="">
                                    <CancelPaymentIntentButton accountType={pi.account_id.accountType} chainId={pi.network as ChainIds} paymentIntent={pi} transactionsLeft={pi.debit_item_id.debit_times - pi.used_for}></CancelPaymentIntentButton>
                                </UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="Only the payee or the wallet that created the account can cancel the payment. You need to sign a transaction with your crypto wallet. DebitLlama is unable to cancel it on the smart contract level."></Tooltip></UnderlinedTd>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
            <hr
                class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <RelayedTxHistory paymentIntent_id={pi.id} searchBy="paymentIntent_id" totalPages={props.data.paymentIntentHistoryTotalpages} txHistory={props.data.paymentIntentHistory}></RelayedTxHistory>

        </div>
    </Layout>
}