//This is for showing subscriptions that are accepted by the customer
import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import PaymentIntentsPaginationForAll from "../../islands/pagination/PaymentIntentsPaginationForAll.tsx";

export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();

        const { data: subscriptions } = await select.PaymentIntents.allByUserIdForCreatorPaginated("created_at", false, 0, 9);

        // Add pagination for both!
        return ctx.render({ ...ctx.state, subscriptions })
    }
}

export default function Subscriptions(props: PageProps) {
    return (
        <Layout isLoggedIn={props.data.token}>
            <section class="container px-4 mx-auto">
                <PaymentIntentsPaginationForAll ></PaymentIntentsPaginationForAll>
            </section>
        </Layout>
    );
}
