import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import AccountCardCarousel from "../../islands/accountCardCarousel.tsx";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";

export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        const { data: accountsData } = await select.Accounts.whereClosedByUserIdOrderDesc();

        const { data: missedPayments } = await select.PaymentIntents.byAccountBalanceTooLowByUserIdForCreatorDesc();

        // Add pagination for both!
        return ctx.render({ ...ctx.state, accountsData, missedPayments })
    }
}

export default function InactiveAccounts(props: PageProps) {
    return (
        <Layout renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
            <AccountCardCarousel
                page="inactive"
                missedPayments={props.data.missedPayments}
                accountData={props.data.accountsData}></AccountCardCarousel>
            <hr class="w-48 h-1 mx-auto my-8 border-0 rounded md:my-10 " />
        </Layout>
    );
}
