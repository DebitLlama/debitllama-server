import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import PaymentIntentsPaginationForDebitItemsPage from "../../islands/pagination/PaymentIntentsPaginationForDebitItemsPage.tsx";

export const handler: Handlers<any, State> = {
    GET(_req, ctx) {
        return ctx.render({ ...ctx.state })
    }
}

export default function paymentIntents(props: PageProps) {
    return <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
        <hr
            class="my-1 h-3 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <section class="container px-4 mx-auto">
            <PaymentIntentsPaginationForDebitItemsPage></PaymentIntentsPaginationForDebitItemsPage>
        </section>
    </Layout>
}
