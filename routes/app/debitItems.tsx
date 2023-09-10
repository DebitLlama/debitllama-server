import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import DebitItemTableRow from "../../islands/DebitItemTableRow.tsx";
import PaymentIntentsPaginationForDebitItemsPage from "../../islands/pagination/PaymentIntentsPaginationForDebitItemsPage.tsx";

export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        const { data: debitItemsData } = await select.Items.byUserIdForPayeeDesc()
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
            <a href={"/app/relayer"} class="mb-8 bg-gradient-to-b w-max mx-auto text-indigo-500 font-semibold from-slate-50 to-indigo-100 px-10 py-3 rounded-2xl shadow-indigo-400 shadow-md border-b-4 hover border-b border-indigo-200 hover:shadow-sm transition-all duration-500">Relayer</a>
        </section>

        <section class="container px-4 mx-auto">
            <DebitItemRows data={debitItemsData}></DebitItemRows>
        </section>
         <hr
            class="my-1 h-3 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <section class="container px-4 mx-auto">
            <PaymentIntentsPaginationForDebitItemsPage></PaymentIntentsPaginationForDebitItemsPage>
        </section>
    </Layout>
}
