import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import PaymentIntentsPaginationForDebitItemsPage from "../../islands/pagination/PaymentIntentsPaginationForDebitItemsPage.tsx";
import { DEBITITEMSTABLEPAGESIZE } from "../../lib/enums.ts";
import { getTotalPages } from "../../lib/backend/businessLogic.ts";
import DebitItemsTable from "../../islands/pagination/DebitItemsTable.tsx";

export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        const { data: debitItemsData, count } = await select.Items.byUserIdForPayeePaginated(
            "created_at", false, 0, 9);
        const totalPages = getTotalPages(count, DEBITITEMSTABLEPAGESIZE);
        return ctx.render({ ...ctx.state, debitItemsData, totalPages })
    }
}


export default function DebitItems(props: PageProps) {
    const debitItemsData = props.data.debitItemsData;
    const totalPages = props.data.totalPages;
    return <Layout isLoggedIn={props.data.token}>
        <section class="flex flex-row">
            <a href={"/app/addNewDebitItem"} class="mb-8 bg-gradient-to-b w-max mx-auto text-indigo-500 font-semibold from-slate-50 to-indigo-100 px-10 py-3 rounded-2xl shadow-indigo-400 shadow-md border-b-4 hover border-b border-indigo-200 hover:shadow-sm transition-all duration-500">New Debit Item</a>
            <a href={"/app/relayer"} class="mb-8 bg-gradient-to-b w-max mx-auto text-indigo-500 font-semibold from-slate-50 to-indigo-100 px-10 py-3 rounded-2xl shadow-indigo-400 shadow-md border-b-4 hover border-b border-indigo-200 hover:shadow-sm transition-all duration-500">Relayer</a>
        </section>

        <section class="container px-4 mx-auto">
            <DebitItemsTable debitItems={debitItemsData} totalPages={totalPages}></DebitItemsTable>
        </section>
        <hr
            class="my-1 h-3 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <section class="container px-4 mx-auto">
            <PaymentIntentsPaginationForDebitItemsPage></PaymentIntentsPaginationForDebitItemsPage>
        </section>
    </Layout>
}
