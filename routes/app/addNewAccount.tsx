import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import AccountCreatePageForm from "../../islands/accountCreatePageForm.tsx";
import { State } from "../_middleware.ts";

const ethEncryptPublicKey = Deno.env.get("ETHENCRYPTPUBLICKEY") || "";
const directdebitContract_donau = Deno.env.get("DIRECTDEBITCONTRACT_DONAUTESTNET") || "";
const usdtm_donau = Deno.env.get("USDTM_DONAUTESTNET") || "";


export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const headers = new Headers();
        const userid = ctx.state.userid;
        const { data: profileData, error: profileError } = await ctx.state.supabaseClient.from("Profiles").select().eq("userid", userid);

        if (profileData[0] === undefined) {
            headers.set("location", "/app/profile");
            return new Response(null, { status: 303, headers })
        } else {
            return ctx.render({ ...ctx.state, ethEncryptPublicKey, directdebitContract_donau, usdtm_donau })
        }
    },
    async POST(_req, ctx) {
        // Here I accept json
        const json = await _req.json();
        // Adda  verificaiton to check if the request contains all the needed things!
        //TODO: verify the contents are good.
        // here I need to query the blockchain to make sure the commitment exists!

        //Then I return accepted
        return new Response(null, { status: 202 })
    }
}

export default function AddNewAccount(props: PageProps) {
    return <Layout isLoggedIn={props.data.token}>
        <div class="container mx-auto py-8">
            <AccountCreatePageForm
                mockERC20Address_donau={props.data.usdtm_donau}
                directdebitContract_donau={props.data.directdebitContract_donau}
                ethEncryptPublicKey={props.data.ethEncryptPublicKey}
            ></AccountCreatePageForm>
        </div>
    </Layout>
}