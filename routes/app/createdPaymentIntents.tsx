import Layout from "../../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { selectPaymentIntentByPaymentIntentAndCreatorUserId } from "../../lib/backend/supabaseQueries.ts";

export const handler: Handlers<any, State> = {
    async GET(req: any, ctx: any) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        const { data: paymentIntentData, error: paymentIntentError } = await selectPaymentIntentByPaymentIntentAndCreatorUserId(
            ctx.state.supabaseClient, query, ctx.state.userid);

        if (paymentIntentData === null || paymentIntentData.length === 0) {
            return ctx.render({ ...ctx.state, notfound: true });
        }
        return ctx.render({ ...ctx.state, notfound: false, paymentIntentData });
    }
}

//TODO: Render the payment history for the creator of the payment so he can see how many times he paid so far!

export default function CreatedPaymentIntents(props: PageProps) {
    return <Layout isLoggedIn={props.data.token}>
        <div class="container mx-auto py-8">
            {!props.data.notfound ? <div></div> : <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
                <h1 class="text-2xl font-bold mb-6 text-center">Not Found</h1>
            </div>}
        </div>
    </Layout>
}