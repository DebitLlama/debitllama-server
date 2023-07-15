import Layout from "../../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";

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

// TODO: buy button link

// TODO: Show the payment intents related to this item!
//TODO: redo the columns withdths so they look even
//TODO: render a copyable code to link to the buy button!!
// Add a copy button for the code snippet!
//Go to buy page should show the buy button!
export default function item(props: PageProps) {
    const itemData = props.data.itemData[0];
    console.log(itemData)
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
                                <a class="cursor-pointer w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                                    Go to Buy page</a>
                            </div>


                        </div>
                    </div>
                    <hr
                        class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
                    <div>
                        Embedd the buy Button on your Website
                    </div>
                    <div class="mx-5 lg:w-6/12 bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
                        <div id="header-buttons" class="py-3 px-4 flex">
                            <div class="rounded-full w-3 h-3 bg-red-500 mr-2"></div>
                            <div class="rounded-full w-3 h-3 bg-yellow-500 mr-2"></div>
                            <div class="rounded-full w-3 h-3 bg-green-500"></div>
                        </div>

                        <div id="code-area" class="py-4 px-4 mt-1 text-white text-xl">
                            <div class="mb-2">
                                <span class="text-yellow-300">const</span> <span class="text-blue-400">pluckDeep</span> <span class="text-green-400">=</span> <span class="text-blue-400">key</span> <span class="text-green-400">=&gt;</span> <span class="text-blue-400">obj</span> <span class="text-green-400">=&gt;</span> <span class="text-purple-600">key</span>.<span class="text-purple-600">split</span>(<span class="text-blue-400">'.'</span>).<span class="text-purple-600">reduce</span>((<span class="text-blue-400">accum</span>, <span class="text-blue-400">key</span>) <span class="text-green-400">=&gt;</span> <span class="text-purple-600">accum</span>[<span class="text-purple-600">key</span>], <span class="text-purple-600">obj</span>)
                            </div>

                            <div class="mb-2">
                                <span class="text-yellow-300">const</span> <span class="text-blue-400">compose</span> <span class="text-green-400">=</span> (<span class="cm-meta">...</span><span class="text-blue-400">fns</span>) <span class="text-green-400">=&gt;</span> <span class="text-blue-400">res</span> <span class="text-green-400">=&gt;</span> <span class="text-purple-600">fns</span>.<span class="text-purple-600">reduce</span>((<span class="text-blue-400">accum</span>, <span class="text-blue-400">next</span>) <span class="text-green-400">=&gt;</span> <span class="text-purple-600">next</span>(<span class="text-purple-600">accum</span>), <span class="text-purple-600">res</span>)
                            </div>

                            <div class="mb-2">
                                <div class="sub-line">
                                    <span class="text-yellow-300">const</span> <span class="text-blue-400">unfold</span> <span class="text-green-400">=</span> (<span class="text-blue-400">f</span>, <span class="text-blue-400">seed</span>) <span class="text-green-400">=&gt;</span>
                                </div>
                                <div class="sub-line ml-8">
                                    <span class="text-yellow-300">const</span> <span class="text-blue-400">go</span> <span class="text-green-400">=</span> (<span class="text-blue-400">f</span>, <span class="text-blue-400">seed</span>, <span class="text-blue-400">acc</span>) <span class="text-green-400">=&gt;</span>
                                </div>
                                <div class="sub-line ml-16">
                                    <span class="text-yellow-300">const</span> <span class="text-blue-400">res</span> <span class="text-green-400">=</span> <span class="text-purple-600">f</span>(<span class="text-purple-600">seed</span>)
                                </div>
                                <div class="sub-line ml-16">
                                    <span class="text-yellow-300">return</span> <span class="text-purple-600">res</span> <span class="text-green-400">?</span> <span class="text-purple-600">go</span>(<span class="text-purple-600">f</span>, <span class="text-purple-600">res</span>[<span class="text-red-600">1</span>], <span class="text-purple-600">acc</span>.<span class="text-purple-600">concat</span>([<span class="text-purple-600">res</span>[<span class="text-red-600">0</span>]])) : <span class="text-purple-600">acc</span>
                                </div>
                                <div class="sub-line ml-8">

                                </div>
                                <div class="sub-line ml-8">
                                    <span class="text-yellow-300">return</span> <span class="text-purple-600">go</span>(<span class="text-purple-600">f</span>, <span class="text-purple-600">seed</span>, [])
                                </div>
                                <div class="sub-line">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
                    <h1 class="text-2xl font-bold mb-6 text-center">Account Not Found</h1>
                </div>}
        </div>
    </Layout>
}