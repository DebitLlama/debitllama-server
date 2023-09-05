import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { AccountCardElement } from "../../components/AccountCardElement.tsx";
import AccountCardCarousel from "../../islands/accountCardCarousel.tsx";
import { selectOpenAccountsByIdDESC, selectPaymentIntentsByUserIdDESC } from "../../lib/backend/supabaseQueries.ts";

export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const { data: accountsData, error: accountsError } = await selectOpenAccountsByIdDESC(ctx.state.supabaseClient, ctx.state.userid);
        ;

        // I also need to fetch the payment intents here!

        const { data: paymentIntentData, error: paymentIntentError } = await selectPaymentIntentsByUserIdDESC(ctx.state.supabaseClient, ctx.state.userid);

        // Add pagination for both!
        return ctx.render({ ...ctx.state, accountsData, paymentIntentData })
    }
}

export default function Accounts(props: PageProps) {
    return (
        <Layout isLoggedIn={props.data.token}>
            <section class="flex flex-row">
                <a href={"/app/addNewAccount"} class="mb-8 bg-gradient-to-b w-max mx-auto text-indigo-500 font-semibold from-slate-50 to-indigo-100 px-10 py-3 rounded-2xl shadow-indigo-400 shadow-md border-b-4 hover border-b border-indigo-200 hover:shadow-sm transition-all duration-500">Create New Account</a>
            </section>
            <AccountCardCarousel paymentIntents={props.data.paymentIntentData} accountData={props.data.accountsData}></AccountCardCarousel>
        </Layout>
    );
}
