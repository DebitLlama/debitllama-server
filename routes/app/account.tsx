import Layout from "../../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";

import { State } from "../_middleware.ts";

export const handler: Handlers<any, State> = {
    GET(_req, ctx) {
        return ctx.render(ctx.state);
    }
}

export default function Account(props: PageProps) {
    return <Layout isLoggedIn={props.data.token}>
        <p>This is teh account page. Well done!</p>
    </Layout>
}