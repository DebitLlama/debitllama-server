import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import QueryBuilder from "../../lib/backend/db/queryBuilder.ts";
import { DEBITITEMSTABLEPAGESIZE } from "../../lib/enums.ts";
import { getTotalPages } from "../../lib/backend/businessLogic.ts";
import DebitItemsTable from "../../islands/pagination/DebitItemsTable.tsx";
import { selectItemsbyUserIdForPayeePaginated } from "../../lib/backend/db/pagination.ts";

export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const queryBuilder = new QueryBuilder(ctx);
        // const select = queryBuilder.select();
        const { data: debitItemsData, count } = await selectItemsbyUserIdForPayeePaginated(ctx, {
            order: "created_at",
            ascending: false,
            rangeFrom: 0,
            rangeTo: 9
        });
        const totalPages = getTotalPages(count, DEBITITEMSTABLEPAGESIZE);
        return ctx.render({ ...ctx.state, debitItemsData, totalPages })
    }
}


export default function DebitItems(props: PageProps) {
    const debitItemsData = props.data.debitItemsData;
    const totalPages = props.data.totalPages;
    return <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
        <hr class="w-48 h-1 mx-auto my-8 border-0 rounded md:my-10 " />
        <section class="container px-4 mx-auto">
            <DebitItemsTable debitItems={debitItemsData} totalPages={totalPages}></DebitItemsTable>
        </section>
        <hr
            class="my-1 h-3 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
    </Layout>
}
