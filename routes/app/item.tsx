import Layout from "../../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import CopyButton from "../../islands/copyButton.tsx";
import { ChainIds, networkNameFromId } from "../../lib/shared/web3.ts";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import PaymentIntentsPaginationForItemPage from "../../islands/pagination/PaymentIntentsPaginationForItemPage.tsx";

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

    const embeddedCode = `<a href="https://app.debitllama.com/buyitnow/?q=${itemData.button_id}"><img width="140px" src={"https://app.debitllama.com/buyitnow.png"}/></a>`

    return <Layout renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
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
                                    <th class="w-1/3"></th>
                                    <th class="w-2/3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Payee Address:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData"> <small>{itemData.payee_address}</small> </div></td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Name:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData"> {itemData.name}</div></td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Network:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}>{networkNameFromId[itemData.network as ChainIds]}</td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Max Debited:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData">  {itemData.max_price} {JSON.parse(itemData.currency).name}</div></td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Debit Times:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData"> {itemData.debit_times}</div></td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Debit Interval (Days):</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData"> {itemData.debit_interval}</div></td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Pricing</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}>{itemData.pricing}</td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Redirect URL:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class={"overflow-x-auto overflowingTableData max-w-sm"}>
                                        <a href={itemData.redirect_url} target="_blank"> {itemData.redirect_url}</a>
                                    </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Checkout:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap flex flex-row justify-start"}>
                                        <a target="_blank" href={`/buyitnow/?q=${itemData.button_id}`} class={"cursor-pointer"}>
                                            <img
                                                width="140px"

                                                src={"/buyitnow.png"}
                                            />
                                        </a>
                                        <img class="blink mb-2" src="/arrowLeft.svg" width={"30"} />
                                    </td>
                                </tr>
                                <tr>
                                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Identifier:</td>
                                    <td class={"px-4 py-4 text-sm whitespace-nowrap flex flex-row"}><div class="overflow-x-auto overflowingTableData"> <p class="text-xs mt-1"> {itemData.button_id} </p>
                                        <CopyButton str={itemData.button_id} iconColor="black"></CopyButton>
                                    </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <DeactivateComponent itemData={itemData}></DeactivateComponent>
                    </div>
                </div>
                <hr
                    class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />

                <div class="overflow-scroll w-full bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
                    <div id="header-buttons" class="py-3 px-4 flex">
                        <div class="rounded-full w-3 h-3 bg-red-500 mr-2"></div>
                        <div class="rounded-full w-3 h-3 bg-yellow-500 mr-2"></div>
                        <div class="rounded-full w-3 h-3 bg-green-500 mr-2"></div>
                        <p class="text-xs text-white">Embed the buy Button on your Website </p>
                        <CopyButton str={embeddedCode} iconColor="white"></CopyButton>
                    </div>
                    <div class="py-4 px-4 mt-1 text-white overflow-auto">
                        <pre class="text-sm">
                            {embeddedCode}
                        </pre>
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
    const description = props.itemData.deleted ? "Reactivating the item will resume the checkout. You will be able to accept payments again!" : "Deactivating the item will disable the checkout page. You will be still able to process the payment intents, however new ones can't be added!"

    return <div class={`flex flex-col justify-center `}>
        <div><h4 class="text-xl mx-auto text-center">{title}</h4></div>

        <p class="p-5 text-center">{description}</p>

        <form class="mx-auto" method={"POST"} action={`/app/item`}>
            <input type={"hidden"} value={props.itemData.button_id} name="button_id" />
            <input type="hidden" value={`${!props.itemData.deleted}`} name="deleted" />
            <button class={`mx-auto mb-8 bg-gradient-to-b w-max mx-auto text-${color}-500 font-semibold from-slate-50 to-${color}-100 px-10 py-3 rounded-2xl shadow-${color}-400 shadow-md border-b-4 hover border-b border-${color}-200 hover:shadow-sm transition-all duration-500`} type={"submit"}>{buttonTitle}</button>
        </form>
    </div>
}