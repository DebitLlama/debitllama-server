import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import AccountCardCarousel from "../../islands/accountCardCarousel.tsx";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";

export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        const { data: accountsData } = await select.Accounts.whereOpenByUserIdOrderDesc();

        const { data: missedPayments } = await select.PaymentIntents.byAccountBalanceTooLowByUserIdForCreatorDesc();

        // Add pagination for both!
        return ctx.render({ ...ctx.state, accountsData, missedPayments })
    }
}

export default function Accounts(props: PageProps) {
    return (
        <Layout isLoggedIn={props.data.token}>
            <section class="flex flex-row">
                <a href={"/app/addNewAccount"} class="mb-8 bg-gradient-to-b w-max mx-auto text-indigo-500 font-semibold from-slate-50 to-indigo-100 px-10 py-3 rounded-2xl shadow-indigo-400 shadow-md border-b-4 hover border-b border-indigo-200 hover:shadow-sm transition-all duration-500">Create New Account</a>
            </section>
            <AccountCardCarousel
                missedPayments={props.data.missedPayments}
                accountData={props.data.accountsData}></AccountCardCarousel>
            <hr class="w-48 h-1 mx-auto my-8 border-0 rounded md:my-10 " />

        </Layout>
    );
}
