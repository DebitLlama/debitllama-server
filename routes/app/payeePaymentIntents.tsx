import Layout from "../../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { NotFound, Tooltip, UnderlinedTd, getDebitIntervalText, getPaymentIntentStatusLogo, getPaymentIntentStatusTooltip, getPaymentRequestJobStatusTooltipMessage, getPaymentRequestStatusLogo, getSubscriptionTooltipMessage } from "../../components/components.tsx";
import CancelPaymentIntentButton from "../../islands/CancelPaymentIntentButton.tsx";
import { ChainIds, networkNameFromId } from "../../lib/shared/web3.ts";
import { DynamicPaymentRequestJobsStatus, PaymentIntentRow, Pricing, RELAYERTRANSACTIONHISTORYPAGESIZE } from "../../lib/enums.ts";
import TriggerDirectDebitButton from "../../islands/TriggerDirectDebitButton.tsx";
import { errorResponseBuilder, successResponseBuilder } from "../../lib/backend/responseBuilders.ts";
import CancelDynamicPaymentRequestButton from "../../islands/CancelDynamicPaymentRequestButton.tsx";
import { addDynamicPaymentRequest } from "../../lib/backend/businessLogic.ts";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import RelayedTxHistory from "../../islands/pagination/RelayedTxHistoryWithPagination.tsx";
import { getTotalPaymentValue } from "../../components/PaymentIntentsTable.tsx";



export const handler: Handlers<any, State> = {
    async GET(req: any, ctx: any) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();

        const { data: paymentIntentData } = await select.PaymentIntents
            .byPaymentIntentAndUserIdForPayee(query);

        if (paymentIntentData === null || paymentIntentData.length === 0) {
            return ctx.render({ ...ctx.state, notfound: true });
        }

        const { data: paymentIntentHistory, count: paymentIntentHistoryTotalpages } = await select.RelayerHistory
            .byPaymentIntentIdPaginated(
                paymentIntentData[0].id,
                "created_at", false, 0, RELAYERTRANSACTIONHISTORYPAGESIZE - 1
            );


        if (paymentIntentData[0].pricing === Pricing.Dynamic) {
            const { data: dynamicPaymentRequestJobArr } = await select.DynamicPaymentRequestJobs
                .byPaymentIntentIdAndUserId(paymentIntentData[0].id);

            return ctx.render({ ...ctx.state, notfound: false, paymentIntentData, paymentIntentHistory, paymentIntentHistoryTotalpages, dynamicPaymentRequestJobArr });
        } else {
            return ctx.render({ ...ctx.state, notfound: false, paymentIntentData, paymentIntentHistory, dynamicPaymentRequestJobArr: [] });
        }
    },
    async POST(req: any, ctx: any) {
        // Request Dynamic Payments using this POST request handler!
        const json = await req.json();
        const paymentIntent = json.paymentIntent;
        const requestedDebitAmount = json.requestedDebitAmount;
        const queryBuilder = new QueryBuilder(ctx);

        try {
            const res = await addDynamicPaymentRequest(paymentIntent, queryBuilder, requestedDebitAmount);
            return successResponseBuilder(res.msg);
        } catch (err: any) {
            return errorResponseBuilder(err.message);
        }
    }
}


export default function CreatedPaymentIntents(props: PageProps) {
    if (props.data.notfound) {
        return <NotFound title="🔎">
            <p class="text-center">After you make a sale the payment intents will be displayed here. They represent a subscription that will be later processed.</p>
            <div class="flex flex-row text-center">
                <a
                    class="mx-auto bg-gradient-to-b w-max text-gray-500 font-semibold from-slate-50 to-gray-100 px-10 py-3 rounded-2xl shadow-gray-400 shadow-md border-b-4 hover border-b border-gray-200 hover:shadow-sm transition-all duration-500"
                    href="/app/paymentIntents">Go to Payment Intents</a>
            </div>
        </NotFound>
    }
    const pi = props.data.paymentIntentData[0] as PaymentIntentRow;
    const dynamicPaymentRequestJobArr = props.data.dynamicPaymentRequestJobArr;

    function IfDynamicAddDebitTrigger(props: { pricing: Pricing, maxDebitAmount: string, dynamicPaymentRequestJob: any }) {
        if (props.pricing === Pricing.Dynamic) {
            return <tr>
                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Request Payment:</UnderlinedTd>
                <UnderlinedTd extraStyles="">
                    {props.dynamicPaymentRequestJob !== undefined && props.dynamicPaymentRequestJob.status === DynamicPaymentRequestJobsStatus.LOCKED
                        ? <p>Your last payment request is locked for processing! Come back in a few minutes!</p>
                        : <TriggerDirectDebitButton chainId={pi.network as ChainIds} paymentIntent={pi} transactionsLeft={pi.debit_item_id.debit_times - pi.used_for}></TriggerDirectDebitButton>}
                </UnderlinedTd>
                <UnderlinedTd extraStyles=""><Tooltip message="For dynamic payments you need to specify how much to debit!"></Tooltip></UnderlinedTd>
            </tr>
        } else {
            return null;
        }
    }

    function IfPaymentRequestJobExists(props: {
        dynamicPaymentRequestJobArr: Array<any>,
        currency: string
    }) {
        if (dynamicPaymentRequestJobArr === null || dynamicPaymentRequestJobArr.length === 0) {
            return null;
        } else {
            return <tr>
                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Latest Payment Request:</UnderlinedTd>
                <UnderlinedTd extraStyles="paddingZero" >
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200  text-sm" >
                                    <p>Status:</p>
                                </UnderlinedTd>
                                <UnderlinedTd extraStyles="">{getPaymentRequestStatusLogo(props.dynamicPaymentRequestJobArr[0].status)}</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message={getPaymentRequestJobStatusTooltipMessage(props.dynamicPaymentRequestJobArr[0].status)}></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200  text-sm" >
                                    <p>
                                        Amount:
                                    </p>
                                </UnderlinedTd>
                                <UnderlinedTd extraStyles="">
                                    {props.dynamicPaymentRequestJobArr[0].requestedAmount} {props.currency}
                                </UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message={"The amount debited from the customers account."}></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200  text-sm" >
                                    <p>
                                        Created Date:
                                    </p>
                                </UnderlinedTd>
                                <UnderlinedTd extraStyles="">
                                    {new Date(props.dynamicPaymentRequestJobArr[0].created_at).toLocaleString()}
                                </UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The date your request was created. The payment will be processed in approx 60 minutes!"></Tooltip></UnderlinedTd>
                            </tr>
                            {props.dynamicPaymentRequestJobArr[0].status === DynamicPaymentRequestJobsStatus.CREATED ? <tr>
                                <UnderlinedTd extraStyles="borderNone bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200  text-sm" >
                                </UnderlinedTd>
                                <UnderlinedTd extraStyles="paddingZero borderNone">
                                    <CancelDynamicPaymentRequestButton
                                        dynamicPaymentRequest={props.dynamicPaymentRequestJobArr[0]}
                                        chainId={pi.network as ChainIds}
                                        paymentIntent={pi}></CancelDynamicPaymentRequestButton>
                                </UnderlinedTd>
                                <UnderlinedTd extraStyles="borderNone">
                                </UnderlinedTd>
                            </tr> : null}
                        </tbody>
                    </table>
                </UnderlinedTd>
                <UnderlinedTd extraStyles="">{""}</UnderlinedTd>
            </tr>
        }
    }

    const currName = JSON.parse(pi.debit_item_id.currency).name;

    return <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
        <div class="container mx-auto py-8">
            <div class="bg-gray-100 border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <div class="text-center"><h1 class="text-2xl font-bold mb-2 text-gray-500 ">Payment Intent</h1></div>
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
                                <UnderlinedTd extraStyles=""><p> {getPaymentIntentStatusLogo(pi.statusText, "payee")}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message={getPaymentIntentStatusTooltip(pi.statusText, "payee")}></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm" >Identifier:</UnderlinedTd>
                                <UnderlinedTd extraStyles="truncate"><pre> {pi.paymentIntent}</pre></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The unique identifier of the payment intent"></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Customer Account Balance:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p>{pi.account_id.balance}  {currName}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The current balance of the account that will be charged."></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm" >Approved Payment:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {pi.debit_item_id.max_price} {currName} </p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The maximum amount that can be debited from the account"></Tooltip></UnderlinedTd>
                            </tr>
                            <IfDynamicAddDebitTrigger dynamicPaymentRequestJob={dynamicPaymentRequestJobArr[0]} pricing={pi.debit_item_id.pricing as Pricing} maxDebitAmount={pi.debit_item_id.max_price}></IfDynamicAddDebitTrigger>
                            <IfPaymentRequestJobExists
                                dynamicPaymentRequestJobArr={props.data.dynamicPaymentRequestJobArr}
                                currency={currName}></IfPaymentRequestJobExists>
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
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm" >Total Payments:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {getTotalPaymentValue(pi.debit_item_id.pricing, pi.debit_item_id.max_price, currName, pi.debitTimes)}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The maximum amount that can be debited from the account during the whole subscription period!"></Tooltip></UnderlinedTd>
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
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Successful Payments:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {pi.used_for} / {pi.debitTimes}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The amount of times the payment intent was used!"></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Last Payment Date:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {pi.lastPaymentDate === null ? "Waiting for first payment." : new Date(pi.lastPaymentDate).toLocaleString()}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The last time this payment intent was used."></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Next Payment Date:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {pi.nextPaymentDate === null ? "" : new Date(pi.nextPaymentDate).toLocaleString()}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The approximate time when the next payment intent will become valid."></Tooltip></UnderlinedTd>
                            </tr>

                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Cancel Payment Intent:</UnderlinedTd>
                                <UnderlinedTd extraStyles="">
                                    <CancelPaymentIntentButton accountType={pi.account_id.accountType} chainId={pi.network as ChainIds} paymentIntent={pi} transactionsLeft={pi.debit_item_id.debit_times - pi.used_for}></CancelPaymentIntentButton>
                                </UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="Only the payee or the wallet that created the account can cancel the payment. You need to sign a transaction."></Tooltip></UnderlinedTd>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <hr
                class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <RelayedTxHistory paymentIntent_id={pi.id} searchBy="paymentIntent_id" totalPages={props.data.paymentIntentHistoryTotalpages} txHistory={props.data.paymentIntentHistory}></RelayedTxHistory>
        </div>
    </Layout >
}