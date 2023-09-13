import Layout from "../../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { Tooltip, UnderlinedTd, getDebitIntervalText, getPaymentIntentStatusLogo, getPaymentRequestJobStatusTooltipMessage, getPaymentRequestStatusLogo, getSubscriptionTooltipMessage } from "../../components/components.tsx";
import CancelPaymentIntentButton from "../../islands/CancelPaymentIntentButton.tsx";
import { ChainIds, networkNameFromId } from "../../lib/shared/web3.ts";
import { DynamicPaymentRequestJobsStatus, PaymentIntentRow, Pricing, RELAYERTRANSACTIONHISTORYPAGESIZE } from "../../lib/enums.ts";
import TriggerDirectDebitButton from "../../islands/TriggerDirectDebitButton.tsx";
import { estimateRelayerGas, formatEther, parseEther } from "../../lib/backend/web3.ts";
import { errorResponseBuilder, successResponseBuilder } from "../../lib/backend/responseBuilders.ts";
import CancelDynamicPaymentRequestButton from "../../islands/CancelDynamicPaymentRequestButton.tsx";
import { calculateGasEstimationPerChain, getGasPrice, getRelayerBalanceForChainId, increaseGasLimit, updateRelayerBalanceWithAllocatedAmount } from "../../lib/backend/businessLogic.ts";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import RelayedTxHistory from "../../islands/pagination/RelayedTxHistoryWithPagination.tsx";



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
        const select = queryBuilder.select();

        const { data: paymentIntentDataArray } = await select.PaymentIntents
            .byPaymentIntentAndUserIdForPayee(paymentIntent);

        if (paymentIntentDataArray === null || paymentIntentDataArray.length === 0) {
            return errorResponseBuilder("Invalid Payment Intent");
        }
        const paymentIntentData = paymentIntentDataArray[0];
        if (parseEther(requestedDebitAmount) > parseEther(paymentIntentData.maxDebitAmount)) {
            return errorResponseBuilder("Requested Amount Too High!");
        }

        if (paymentIntentData.pricing !== Pricing.Dynamic) {
            return errorResponseBuilder("Only accepting dynamic priced payment intents!");
        }

        if (parseEther(requestedDebitAmount) <= 0) {
            return errorResponseBuilder("Zero or negative payments are not accepted!");
        }


        if (paymentIntentData.nextPaymentDate !== null &&
            new Date().getTime() < new Date(paymentIntentData.nextPaymentDate).getTime()) {
            // If next payment date is set, I check if the current date exceeds it or not.
            // If not, then it might be too early to send this transaction and it would fail...
            return errorResponseBuilder("Payment not due! Check next payment date. If you try to debit too early the transaction will fail!");
        }


        const estimation = await estimateRelayerGas({
            proof: paymentIntentData.proof,
            publicSignals: paymentIntentData.publicSignals,
            payeeAddress: paymentIntentData.payee_address,
            maxDebitAmount: paymentIntentData.maxDebitAmount,
            actualDebitedAmount: requestedDebitAmount,
            debitTimes: paymentIntentData.debitTimes,
            debitInterval: paymentIntentData.debitInterval
        }, paymentIntentData.network).catch(err => {
            console.log(err)
        });

        if (estimation === null || estimation === undefined) {
            return errorResponseBuilder("Unable to Create Debit Request. Gas estimation for the transaction failed.")
        }

        const { data: relayerBalanceDataArr } = await select.RelayerBalance.byUserId();

        if (relayerBalanceDataArr === null || relayerBalanceDataArr.length === 0) {
            return errorResponseBuilder("Relayer balance not found!");
        }

        const relayerBalance = getRelayerBalanceForChainId(paymentIntentData.network, relayerBalanceDataArr[0]);
        const feeData = await getGasPrice(paymentIntentData.network);


        const estimationForChain = calculateGasEstimationPerChain(paymentIntentData.network, feeData, increaseGasLimit(estimation));

        if (!estimationForChain) {
            return errorResponseBuilder("Unable to estimate gas!");
        }

        if (parseEther(relayerBalance) < estimationForChain) {
            return errorResponseBuilder(`Relayer balance too low. You need to top up the relayer with at least ${formatEther(estimationForChain)} ${JSON.parse(paymentIntentData.currency).name}`)
        }

        const { data: dynamicPaymentRequestJobDataArr } = await select.DynamicPaymentRequestJobs
            .byPaymentIntentIdAndUserId(paymentIntentData.id)

        const insert = queryBuilder.insert();
        const update = queryBuilder.update();

        if (dynamicPaymentRequestJobDataArr === null || dynamicPaymentRequestJobDataArr.length === 0) {
            // I need to insert an new job!
            await insert.DynamicPaymentRequestJobs.newJob(
                paymentIntentData.id,
                requestedDebitAmount,
                formatEther(estimationForChain),
                relayerBalanceDataArr[0].id
            );
            await updateRelayerBalanceWithAllocatedAmount(
                queryBuilder,
                relayerBalanceDataArr[0].id,
                paymentIntentData.network,
                relayerBalance,
                "0",
                formatEther(estimationForChain)
            )
        } else {

            if (dynamicPaymentRequestJobDataArr[0].status === DynamicPaymentRequestJobsStatus.LOCKED) {
                return errorResponseBuilder("Payment request is locked. You can't update it anymore!")
            }

            // I update the existing job!
            await update.DynamicPaymentRequestJobs
                .ByPaymentIntentIdAndRequestCreator(
                    paymentIntentData.id,
                    requestedDebitAmount,
                    formatEther(estimationForChain)
                );

            await updateRelayerBalanceWithAllocatedAmount(
                queryBuilder,
                relayerBalanceDataArr[0].id,
                paymentIntentData.network,
                relayerBalance,
                dynamicPaymentRequestJobDataArr[0].allocatedGas,
                formatEther(estimationForChain)
            )
        }

        if (parseEther(requestedDebitAmount) > parseEther(paymentIntentData.account_id.balance)) {
            await update.PaymentIntents.statusTextToAccountBalanceTooLowById(
                paymentIntentData
            );
            return successResponseBuilder("Request Created but customer balance too low! We notified the customer about the pending payment!");
        }

        return successResponseBuilder("Request Created!")
    }
}


export default function CreatedPaymentIntents(props: PageProps) {
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

    return <Layout isLoggedIn={props.data.token}>
        <div class="container mx-auto py-8">
            {!props.data.notfound ? <>  <div class="bg-gray-100 border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <div class="text-center"><h1 class="text-2xl font-bold mb-2 text-gray-500 dark:text-gray-40">Payment Intent</h1></div>
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
                                <UnderlinedTd extraStyles=""><Tooltip message="The current status of the payment"></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm" >Identifier:</UnderlinedTd>
                                <UnderlinedTd extraStyles="truncate"><pre> {pi.paymentIntent}</pre></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The unique identifier of the payment intent"></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Customer Account Balance:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p>{pi.account_id.balance}  {JSON.parse(pi.debit_item_id.currency).name}</p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The current balance of the account that will be charged."></Tooltip></UnderlinedTd>
                            </tr>
                            <tr>
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm" >Approved Payment:</UnderlinedTd>
                                <UnderlinedTd extraStyles=""><p> {pi.debit_item_id.max_price} {JSON.parse(pi.debit_item_id.currency).name} </p></UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="The maximum amount that can be debited from the account"></Tooltip></UnderlinedTd>
                            </tr>
                            <IfDynamicAddDebitTrigger dynamicPaymentRequestJob={dynamicPaymentRequestJobArr[0]} pricing={pi.debit_item_id.pricing as Pricing} maxDebitAmount={pi.debit_item_id.max_price}></IfDynamicAddDebitTrigger>
                            <IfPaymentRequestJobExists
                                dynamicPaymentRequestJobArr={props.data.dynamicPaymentRequestJobArr}
                                currency={JSON.parse(pi.debit_item_id.currency).name}></IfPaymentRequestJobExists>
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
                                <UnderlinedTd extraStyles="bg-gray-50 dark:bg-gray-800 text-slate-400 dark:text-slate-200 text-sm">Cancel Payment Intent:</UnderlinedTd>
                                <UnderlinedTd extraStyles="">
                                    <CancelPaymentIntentButton chainId={pi.network as ChainIds} paymentIntent={pi} transactionsLeft={pi.debit_item_id.debit_times - pi.used_for}></CancelPaymentIntentButton>
                                </UnderlinedTd>
                                <UnderlinedTd extraStyles=""><Tooltip message="Only the payee or the wallet that created the account can cancel the payment. You need to sign a transaction."></Tooltip></UnderlinedTd>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
                <hr
                    class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
                <div class="flex flex-row justify-center">
                    <h4 class={"text-gray-400"}>Transaction History</h4>
                </div>
                <hr
                    class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
                <RelayedTxHistory paymentIntent_id={pi.id} searchBy="paymentIntent_id" totalPages={props.data.paymentIntentHistoryTotalpages} txHistory={props.data.paymentIntentHistory}></RelayedTxHistory>
            </> : <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
                <h1 class="text-2xl font-bold mb-6 text-center">Not Found</h1>
            </div>}
        </div>
    </Layout>
}