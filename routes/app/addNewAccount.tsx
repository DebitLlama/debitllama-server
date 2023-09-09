import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import AccountCreatePageForm from "../../islands/accountCreatePageForm.tsx";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import { State } from "../_middleware.ts";

const ethEncryptPublicKey = Deno.env.get("ETHENCRYPTPUBLICKEY") || "";


export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const headers = new Headers();
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        const { data: profileData } = await select.Profiles.byUserId();

        if (profileData === null || profileData.length === 0) {
            headers.set("location", "/app/profile");
            return new Response(null, { status: 303, headers })
        } else {
            return ctx.render({ ...ctx.state, ethEncryptPublicKey, walletaddress: profileData[0].walletaddress })
        }
    }
}

export default function AddNewAccount(props: PageProps) {
    return <Layout isLoggedIn={props.data.token}>
        <div class="container mx-auto py-8">
            <AccountCreatePageForm
                ethEncryptPublicKey={props.data.ethEncryptPublicKey}
                walletaddress={props.data.walletaddress}
            ></AccountCreatePageForm>
        </div>
    </Layout>
}