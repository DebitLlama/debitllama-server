//This is for showing subscriptions that are accepted by the customer
import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import PaymentIntentsPaginationForAll from "../../islands/pagination/PaymentIntentsPaginationForAll.tsx";
import { selectPaymentIntentsAllByUserIdForCreatorPaginated } from "../../lib/backend/db/pagination.ts";

export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const { data: subscriptions } = await selectPaymentIntentsAllByUserIdForCreatorPaginated(ctx, {
            order: "created_at",
            ascending: false,
            rangeFrom: 0,
            rangeTo: 9
        });
        return ctx.render({ ...ctx.state, subscriptions })
    }
}

export default function Subscriptions(props: PageProps) {
    return (
        <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
            <hr class="w-48 h-1 mx-auto my-8 border-0 rounded md:my-10 " />
            <section class="container px-4 mx-auto">
                <PaymentIntentsPaginationForAll ></PaymentIntentsPaginationForAll>
            </section>
        </Layout>
    );
}
