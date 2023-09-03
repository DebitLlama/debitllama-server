import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { ChainIds, networkNameFromId } from "../../lib/shared/web3.ts";

export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const userid = ctx.state.userid;
        const { data: debitItemsData, error: debitItemsError } = await ctx.state.supabaseClient.from("Items").select().eq("payee_id", userid).order("created_at", { ascending: false })
        return ctx.render({ ...ctx.state, debitItemsData })
    }
}

interface DebitItemsDataProps {
    data: any
}

function DebitItemRows(props: DebitItemsDataProps) {

    if (props.data.length === 0 || props.data === null) {
        return <div></div>
    } else {
        return <div class="flex flex-col">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" class="relative py-3.5 px-4">
                                        <span class="sr-only">View</span>
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        Payment Intents
                                    </th>

                                    <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        Name
                                    </th>

                                    <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        Network
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        Pricing
                                    </th>

                                    <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        Amount
                                    </th>

                                    <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        Debit interval (Days)
                                    </th>

                                    <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        Debit Times
                                    </th>

                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                {props.data.map((d: any) => <DebitItemTableRow
                                    debitTimes={d.debit_times}
                                    debitInterval={d.debit_interval}
                                    currency={JSON.parse(d.currency).name}
                                    maxDebitAmount={d.max_price}
                                    network={d.network}
                                    pricing={d.pricing}
                                    name={d.name}
                                    button_id={d.button_id}
                                    payment_intents_count={d.payment_intents_count}
                                    deleted={d.deleted}
                                ></DebitItemTableRow>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default function DebitItems(props: PageProps) {
    const debitItemsData = props.data.debitItemsData;

    return <Layout isLoggedIn={props.data.token}>
        <section class="flex flex-row">
            <a href={"/app/addNewDebitItem"} class="mb-8 bg-gradient-to-b w-max mx-auto text-indigo-500 font-semibold from-slate-50 to-indigo-100 px-10 py-3 rounded-2xl shadow-indigo-400 shadow-md border-b-4 hover border-b border-indigo-200 hover:shadow-sm transition-all duration-500">New Debit Item</a>
        </section>
        <section class="container px-4 mx-auto">
            <DebitItemRows data={debitItemsData}></DebitItemRows>
        </section>

    </Layout>
}

interface DebitItemTableRowProps {
    name: string,
    network: string,
    maxDebitAmount: string,
    currency: string,
    debitInterval: string,
    debitTimes: string,
    pricing: string,
    button_id: string,
    payment_intents_count: number
    deleted: boolean
}

function GetRowIcon(isDeleted: boolean) {
    if (isDeleted) {
        return <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-320h80v-166l64 62 56-56-160-160-160 160 56 56 64-62v166ZM280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" /></svg>
    } else {
        return <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M570-104q-23 23-57 23t-57-23L104-456q-11-11-17.5-26T80-514v-286q0-33 23.5-56.5T160-880h286q17 0 32 6.5t26 17.5l352 353q23 23 23 56.5T856-390L570-104Zm-57-56 286-286-353-354H160v286l353 354ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640ZM160-800Z" /></svg>
    }
}

function DebitItemTableRow(props: DebitItemTableRowProps) {
    const network = networkNameFromId[props.network as ChainIds];
    return <tr >
        <td class="px-4 py-4 text-sm whitespace-nowrap">
            <div class="flex items-center gap-x-6">
                <a href={`/app/item?q=${props.button_id}`} class="text-indigo-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none">
                    {GetRowIcon(props.deleted)} View
                </a>
            </div>
        </td>
        <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{props.payment_intents_count}</td>
        <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
            <div class="flex items-center gap-x-2">
                <div>
                    <p class="text-xs font-normal text-gray-600 dark:text-gray-400">{props.name}</p>
                </div>
            </div>
        </td>
        <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
            <div class="flex items-center gap-x-2">
                <div>
                    <p class="text-xs font-normal text-gray-600 dark:text-gray-400">{network}</p>
                </div>
            </div>
        </td>
        <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
            <div class="flex items-center gap-x-2">
                <div>
                    <p class="text-xs font-normal text-gray-600 dark:text-gray-400">{props.pricing}</p>
                </div>
            </div>
        </td>
        <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
            <div class="flex items-center gap-x-2">
                <div>
                    <p class="text-xs font-normal text-gray-600 dark:text-gray-400">{props.maxDebitAmount} {props.currency}</p>
                </div>
            </div>
        </td>
        <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{props.debitInterval}</td>
        <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{props.debitTimes}</td>
    </tr>
}

function PaginationButtons() {
    return <div class="flex items-center justify-between mt-6">
        <a href="#" class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>

            <span>
                previous
            </span>
        </a>

        <div class="items-center hidden md:flex gap-x-3">
            <a href="#" class="px-2 py-1 text-sm text-indigo-500 rounded-md dark:bg-gray-800 bg-indigo-100/60">1</a>
            <a href="#" class="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">2</a>
            <a href="#" class="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">3</a>
            <a href="#" class="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">...</a>
            <a href="#" class="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">12</a>
            <a href="#" class="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">13</a>
            <a href="#" class="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">14</a>
        </div>

        <a href="#" class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
            <span>
                Next
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
        </a>
    </div>
}