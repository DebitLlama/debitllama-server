import Layout from "../../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import CopyButton from "../../islands/copyButton.tsx";

export const handler: Handlers<any, State> = {
    async GET(req: any, ctx: any) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        const { data: itemData, error: itemError } = await ctx.state.supabaseClient.from("Items").select().eq("button_id", query);
        if (itemData === null || itemData.length === 0) {
            return ctx.render({ ...ctx.state, notfound: true });
        }
        return ctx.render({ ...ctx.state, notfound: false, itemData });
    }
}


// TODO: Show the payment intents related to this item!
export default function item(props: PageProps) {
    const itemData = props.data.itemData[0];

    const embeddedCode = `<a href="https://app.debitllama.com/buyitnow/?q=${itemData.button_id}"><img width="140px" src={"https://app.debitllama.com/buyitnow.png"}/></a>`

    return <Layout isLoggedIn={props.data.token}>
        <div class="container mx-auto py-8">
            {!props.data.notfound ?
                <div class="flex flex-col items-center justify-center h-full">
                    <div class="bg-white shadow-2xl p-6 rounded-2xl border-2 border-gray-50 w-96">
                        <div class="flex flex-col">
                            <div class="mb-5">
                                <h1 class="text-2xl font-bold text-center">Debit Item</h1>
                            </div>

                            <div class="flex flex-col mb-3">
                                <p class="text-xs text-gray-700 text-center">Payee Address:</p>
                                <pre class="overflow-hidden text-xs text-gray-700 text-center">{itemData.payee_address}</pre>
                            </div>


                            <div class="flex flex-row justify-between mb-3">
                                <div class="flex flex-col mb-3 w-1/3">
                                    <p class="text-center text-xs text-gray-700">Name:</p>
                                    <p class="text-center">{itemData.name}</p>
                                </div>
                                <div class="flex flex-col mb-3 w-1/3">
                                    <p class="text-center text-xs text-gray-700">Network:</p>
                                    <p class="text-center">{itemData.network}</p>
                                </div>
                            </div>


                            <div class="flex flex-row justify-between mb-3">

                                <div class="flex flex-col mb-3 w-1/3">
                                    <p class="text-center text-xs text-gray-700">Max Debited:</p>
                                    <p class="text-center">{itemData.max_price} {JSON.parse(itemData.currency).name}</p>
                                </div>

                                <div class="flex flex-col w-1/3">
                                    <p class="text-center text-xs text-gray-700">Debit Times:</p>
                                    <p class="text-center">{itemData.debit_times}</p>
                                </div>

                                <div class="flex flex-col w-1/3">
                                    <p class="text-center text-xs text-gray-700">Debit Interval (Days)</p>
                                    <p class="text-center">{itemData.debit_interval}</p>
                                </div>
                            </div>
                            <div class="flex flex-row justify-between mb-3">

                                <div class="flex flex-col mb-3 w-1/3">
                                    <p class="text-center text-xs text-gray-700">Pricing</p>
                                    <p class="text-center">{itemData.pricing}</p>
                                </div>

                                <div class="flex flex-col w-1/3">
                                    <p class="text-center text-xs text-gray-700">Type</p>
                                    <p class="text-center">{itemData.debitType}</p>
                                </div>

                            </div>

                            <div class="flex flex-col mb-6">
                                <p class="text-center text-xs text-gray-700">Redirect Url</p>
                                <p class="text-center">{itemData.redirect_url}</p>
                            </div>

                            <div class="flex flex-col">
                                <small class={"mx-auto"}>Navigate to the checkout page:</small>
                                <a href={`/buyitnow/?q=${itemData.button_id}`} class={"cursor-pointer mx-auto"}>
                                    <img
                                        width="140px"

                                        src={"/buyitnow.png"}
                                    />
                                </a>
                            </div>
                            <div class="mb-4 mt-4">
                                <div class="flex flex-row justify-center w-full">
                                    <p class="text-sm">Identifier: </p>
                                </div>
                                <div class="flex flex-row justify-center w-full">
                                    <p class="text-xs mt-1"> {itemData.button_id} </p>
                                    <CopyButton str={itemData.button_id}></CopyButton>
                                </div>
                            </div>


                        </div>
                    </div>
                    <hr
                        class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
                    <div class="flex flex-row justify-center w-full">
                        <p class="text-xs mt-1">Embedd the buy Button on your Website </p>
                        <CopyButton str={embeddedCode}></CopyButton>
                    </div>
                    <div class="overflow-scroll w-80 mx-5 bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
                        <div id="header-buttons" class="py-3 px-4 flex">
                            <div class="rounded-full w-3 h-3 bg-red-500 mr-2"></div>
                            <div class="rounded-full w-3 h-3 bg-yellow-500 mr-2"></div>
                            <div class="rounded-full w-3 h-3 bg-green-500"></div>
                        </div>

                        <div class="py-4 px-4 mt-1 text-white">
                            <pre class="text-sm">
                                {embeddedCode}
                            </pre>
                        </div>
                    </div>
                </div>
                : <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
                    <h1 class="text-2xl font-bold mb-6 text-center">Not Found</h1>
                </div>}
        </div>
    </Layout>
}