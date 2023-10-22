import Layout from "../../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import CopyButton from "../../islands/copyButton.tsx";
import { ChainIds, networkNameFromId } from "../../lib/shared/web3.ts";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import PaymentIntentsPaginationForItemPage from "../../islands/pagination/PaymentIntentsPaginationForItemPage.tsx";
import { Tooltip } from "../../components/components.tsx";

export const handler: Handlers<any, State> = {
    async GET(req: any, ctx: any) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();

        const { data: itemData } = await select.Items.byButtonIdForPayeeOnly(query);
        if (itemData === null || itemData.length === 0) {
            return ctx.render({ ...ctx.state, notfound: true });
        }

        const { data: paymentIntentData, error: paymentIntentError } = await select.PaymentIntents.byItemIdAndUserIdForPayeeOrderDesc(itemData[0].id);

        return ctx.render({ ...ctx.state, notfound: false, itemData, paymentIntentData });
    },
    async POST(req: any, ctx: any) {
        const form = await req.formData();
        const deleted = form.get("deleted") as boolean;
        const button_id = form.get("button_id") as string;
        const queryBuilder = new QueryBuilder(ctx);
        const update = queryBuilder.update();

        await update.Items.deletedByButtonIdForPayee(deleted, button_id);


        return new Response("", {
            status: 301,
            headers: { Location: "/app/debitItems" }
        })
    }
}


export default function Item(props: PageProps) {

    if (props.data.notfound) {
        return <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
            <h1 class="text-2xl font-bold mb-6 text-center">Not Found</h1>
        </div>;
    }

    const itemData = props.data.itemData[0];

    const embeddedCode = `<a href="https://debitllama.com/buyitnow/?q=${itemData.button_id}"><img alt="Buy it now with DebitLlama" width="140px" src="https://debitllama.com/buyitnow.png"/></a>`

    return <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
        <div class="container mx-auto py-8">
            <div>
                <div class="bg-gray-100 shadow-2xl rounded-2xl border-2 border-gray-50 w-full">
                    <div class="flex flex-col">
                        <div >
                            <h1 class="text-2xl text-gray-500 font-bold text-center">Debit Item</h1>
                        </div>

                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th class="w-2/6 md:w-2/12"></th>
                                    <th class="w-3/6"></th>
                                    <th class="w-1/6 md:w-1/12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Checkout:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap flex flex-row justify-start"}>
                                        <a target="_blank" href={`/buyitnow/?q=${itemData.button_id}`} class={"cursor-pointer"}>
                                            <img
                                                width="140px"
                                                alt="Buy it now with DebitLlama"
                                                src={"/buyitnow.png"}
                                            />
                                        </a>
                                        <img alt="Click here to buy it now" class="blink mb-2" src="/arrowLeft.svg" width={"30"} />
                                    </td>
                                    <td><Tooltip message={"Navigate to the checkout page! This button is the same that you can link on your website!"}></Tooltip></td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Payee Address:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData"> <small>{itemData.payee_address}</small> </div></td>
                                    <td><Tooltip message={"The address that will receive the payment from the subscriptions!"}></Tooltip></td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Name:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData"> {itemData.name}</div></td>
                                    <td><Tooltip message={"This is the name of the item the lets you identify it easily"}></Tooltip></td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Network:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}>{networkNameFromId[itemData.network as ChainIds]}</td>
                                    <td><Tooltip message={"The blockchain network where the payments will be processed!"}></Tooltip></td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Max Debited:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData">  {itemData.max_price} {JSON.parse(itemData.currency).name}</div></td>
                                    <td><Tooltip message={"The maximum allowed amount to debit. For fixed pricing this is the actual amount, for dynamic pricing this is the maximum amount"}></Tooltip></td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Debit Times:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData"> {itemData.debit_times}</div></td>
                                    <td><Tooltip message={"The amount of times the amount will be debited."}></Tooltip></td>

                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Debit Interval (Days):</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData"> {itemData.debit_interval}</div></td>
                                    <td><Tooltip message={"The interval of days that need to pass after the last payment date, before the next one can be processed!"}></Tooltip></td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Pricing</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}>{itemData.pricing}</td>
                                    <td><Tooltip message={"Pricing defines if the payment is automatically processed or it must be initiated manually with a custom payment amount!"}></Tooltip></td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Redirect URL:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class={"overflow-x-auto overflowingTableData max-w-sm"}>
                                        <form method={"POST"} action={"/app/updateItemUrl"} class="flex flex-col justify-left">
                                            <input type="hidden" name="button_id" value={itemData.button_id} />
                                            <input type="url" name="redirect_url" required value={itemData.redirect_url} class="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" />
                                            <button class="w-32 text-md font-bold mb-2 mt-2 text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 rounded-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800" type="submit">Update Url</button>
                                        </form>
                                    </div>
                                    </td>
                                    <td><Tooltip message={"When the checkout is completed the page will redirect to this URL. Find more information about how it works in the documentation!"}></Tooltip></td>
                                </tr>

                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Identifier:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap flex flex-row"}><div class="overflow-x-auto overflowingTableData"> <p class="text-xs mt-1"> {itemData.button_id} </p>
                                        <CopyButton str={itemData.button_id} iconColor="black"></CopyButton>
                                    </div>
                                    </td>
                                    <td><Tooltip message={"This is the custom identifier of this item, used for the checkout page link!"}></Tooltip></td>
                                </tr>

                            </tbody>
                        </table>
                        <DeactivateComponent itemData={itemData}></DeactivateComponent>
                    </div>
                    <hr
                        class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />

                    <div class="overflow-scroll w-full bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
                        <div id="header-buttons" class="py-3 px-4 flex">
                            <div class="rounded-full w-3 h-3 bg-red-500 mr-2"></div>
                            <div class="rounded-full w-3 h-3 bg-yellow-500 mr-2"></div>
                            <div class="rounded-full w-3 h-3 bg-green-500 mr-2"></div>
                            <p class="text-xs text-white">Embed the buy Button on your Website </p>
                        </div>
                        <div class="py-4 px-4 mt-1 text-white overflow-auto">
                            <pre class="text-sm">
                                <pre class="text-sm break-all">
                                    <span class="text-yellow-500">{`<a`}</span>{"\n "}
                                    <span class="text-yellow-200">href="</span>
                                    <span class="">{`https://debitllama.com/buyitnow/?q=`}</span>
                                    <span class="text-red-300">{itemData.button_id}</span>
                                    <span class="text-yellow-200">"</span>
                                    <span class="text-yellow-500">{`>\n `}</span>
                                    <span class="text-yellow-500">{`<img `}</span>
                                    <span>{`\n  `}</span>
                                    <span class="text-yellow-200">width="</span>
                                    <span class="">{`140px`}</span>
                                    <span class="text-yellow-200">"{`\n  `}</span>
                                    <span class="text-yellow-200">alt="</span>
                                    <span class="">{`Buy it now with DebitLlama`}</span>
                                    <span class="text-yellow-200">"{`\n  `}</span>
                                    <span class="text-yellow-200">src="</span>
                                    <span class="">{`https://debitllama.com/buyitnow.png`}</span>
                                    <span class="text-yellow-200">"</span>
                                    <span class="text-yellow-500">{`/>\n`}</span>
                                    <span class="text-yellow-500">{`</a>`}</span>
                                </pre>
                            </pre>
                        </div>
                        <div class="px-4 py-4 flex flex-row">
                            <CopyButton str={embeddedCode} iconColor="white"></CopyButton>
                        </div>

                    </div>
                </div>

                <hr
                    class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
                <section class="container px-4 mx-auto">
                    <PaymentIntentsPaginationForItemPage debit_item_id={itemData.id}></PaymentIntentsPaginationForItemPage>
                </section>
                <hr
                    class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />

            </div>
        </div>
    </Layout>
}

interface DeactivateComponentProps {
    itemData: any
}

function DeactivateComponent(props: DeactivateComponentProps) {
    const title = props.itemData.deleted ? "Reactivate Item" : "Deactivate Item";
    const color = props.itemData.deleted ? "green" : "red";
    const buttonTitle = props.itemData.deleted ? "Reactivate Item" : "Deactivate Item";
    const description = props.itemData.deleted ? "Reactivating the item will resume the checkout. You will be able to accept payments again!" : "Deactivating the item will disable the checkout page. The created payment intents will be processed, however new ones can't be added!"

    return <div class={`flex flex-row justify-between w-64`}>
        <form method={"POST"} action={`/app/item`}>
            <input type={"hidden"} value={props.itemData.button_id} name="button_id" />
            <input type="hidden" value={`${!props.itemData.deleted}`} name="deleted" />
            <button class={`bg-gradient-to-b w-max mx-auto text-${color}-500 font-semibold from-slate-50 to-${color}-100 px-10 py-3 rounded-2xl shadow-${color}-400 shadow-md border-b-4 hover border-b border-${color}-200 hover:shadow-sm transition-all duration-500`} type={"submit"}>{buttonTitle}</button>
        </form>
        <div class="flex flex-col justify-center"> <Tooltip message={description}></Tooltip></div>
    </div>
}