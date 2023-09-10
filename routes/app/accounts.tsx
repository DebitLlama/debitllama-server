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

        const { data: paymentIntentData } = await select.PaymentIntents.byUserIdForCreatorDesc();

        const { data: missedPayments } = await select.PaymentIntents.byAccountBalanceTooLowByUserIdForCreatorDesc();

        // Add pagination for both!
        return ctx.render({ ...ctx.state, accountsData, paymentIntentData, missedPayments })
    }
}

export default function Accounts(props: PageProps) {
    return (
        <Layout isLoggedIn={props.data.token}>
            <a href={"/app/addNewAccount"} class="fixed z-90 bottom-10 right-8 bg-gray-100	text-indigo-500 font-semibold from-slate-50 to-indigo-100 px-10 py-3 rounded-2xl shadow-indigo-400 shadow-md border-b-4 hover border-b border-indigo-200 hover:shadow-sm transition-all duration-500">Create New Account</a>
            <AccountCardCarousel
                missedPayments={props.data.missedPayments}
                paymentIntents={props.data.paymentIntentData}
                accountData={props.data.accountsData}></AccountCardCarousel>
            <hr class="w-48 h-1 mx-auto my-8 border-0 rounded md:my-10 " />

        </Layout>
    );
}
