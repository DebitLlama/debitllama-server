// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import { State } from "../_middleware.ts";
export const handler: Handlers<any, State> = {
    async POST(req, ctx) {
        const form = await req.formData();
        const subject = form.get("subject") as string;
        const message = form.get("message") as string;
        const queryBuilder = new QueryBuilder(ctx);
        const insert = queryBuilder.insert();
        const { error } = await insert.Feedback.newFeedback(subject, message);
        const headers = new Headers();

        if (error) {
            headers.set("location", `/app/feedback?error=${"Unable to save feedback"}`)
        } else {
            headers.set("location", `/app/feedback?success=${"Message sent!"}`)
        }

        return new Response(null, { status: 303, headers })

    },

    GET(_req, ctx) {
        return ctx.render({ ...ctx.state })
    }
}

export default function Feedback(props: PageProps) {
    const err = props.url.searchParams.get("error");
    const success = props.url.searchParams.get("success");

    return <Layout renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
        <div class="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
            <div class="mx-auto text-center">
                <h1 class="text-xl" >(WORK IN PROGRESS)</h1>
                <h2 class="text-lg" >API ACCESS </h2>

                <p class="text-sm">ACCESS TOKENS AND WEBHOOK ENDPOINT SETTINGS GO HERE</p>

            </div>
        </div>
    </Layout>
}