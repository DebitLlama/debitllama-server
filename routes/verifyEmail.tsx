import { Handlers, PageProps } from "$fresh/server.ts";
import { NotFound } from "../components/components.tsx";
import QueryBuilder from "../lib/backend/db/queryBuilder.ts";
import { State } from "./_middleware.ts";

export const handler: Handlers<any, State> = {
    async GET(req, ctx) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        const update = queryBuilder.update();

        const { data, error } = await select.VerifiedEmails.byUrl(query);
        if (data.length === 0 || error !== null) {
            //Return not found
            return ctx.render({ ...ctx.state, notfound: true });
        } else {
            // I will delete that temporary url and update the email to verified!
            await update.VerifiedEmails.updateToVerified(data[0].user_id);
            return ctx.render({ ...ctx.state, notfound: false })
        }
    }
}



export default function VerifyPassword(props: PageProps) {
    if (props.data.notfound) {
        return <NotFound title="Not Found">
            <div class="flex flex-row justify-center">
                <a class="mx-auto text-xl text-indigo-800" href="/login">Go to Login</a>
            </div>
        </NotFound>
    }
    return <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
        <h1 class="text-2xl font-bold mb-6 text-center">Email Verified 🚀</h1>
        <div class="flex flex-row justify-center">
            <a class="mx-auto text-xl text-indigo-800" href="/login">Go to Login</a>
        </div>
    </div>
}