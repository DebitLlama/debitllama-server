import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import AccountCreatePageForm from "../../islands/accountCreatePageForm.tsx";
import { State } from "../_middleware.ts";

export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const headers = new Headers();
        const userid = ctx.state.userid;
        const { data: profileData, error: profileError } = await ctx.state.supabaseClient.from("Profiles").select().eq("userid", userid);

        if (profileData[0] === undefined) {
            headers.set("location", "/app/profile");
            return new Response(null, { status: 303, headers })
        } else {
            return ctx.render({ ...ctx.state })
        }
    },
    POST(_req, ctx) {
        return ctx.render({ ...ctx.state })
    }
}

export default function AddNewAccount(props: PageProps) {
    return <Layout isLoggedIn={props.data.token}>
        <div class="container mx-auto py-8">
            <AccountCreatePageForm></AccountCreatePageForm>
        </div>
    </Layout>
}