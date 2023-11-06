import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../../_middleware.ts";
import Layout from "../../../components/Layout.tsx";
import { selectAllAccountAuthenticatorsByUserId } from "../../../lib/backend/db/tables/AccountAuthenticators.ts";
import AddNewAccountPasskeyButton from "../../../islands/AddNewAccountPasskeyButton.tsx";
import { UiSwitcherButtons } from "../../../components/APiUi.tsx";

export const handler: Handlers<any, State> = {
    async GET(req, ctx) {
        // It should get the authentication devices count and return it
        const { data } = await selectAllAccountAuthenticatorsByUserId(ctx, {});
        return ctx.render({ ...ctx.state, authenticators: data });
    },
};

export default function AccountPasskeys(props: PageProps) {

    const addedPasskeys = props.data.authenticatorCount;

    return <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
        <div class="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center border p-5">
            <div class="flex flex-row justify-end">
                <UiSwitcherButtons
                    text="2FA"
                    navigateTo="/app/webauthn/2fa"
                    disabled={false}
                ></UiSwitcherButtons>
                <UiSwitcherButtons
                    text="Accounts"
                    navigateTo="/app/webauthn/accounts"
                    disabled={true}
                ></UiSwitcherButtons>
            </div>

            <div class="flex flex-row justify-center">
                <h1 class="text-5xl font-bold mb-5">Spending Account Passkeys</h1>
            </div>

            <div class="flex flex-col justify-center">

                <p class="text-lg">To use a passkey to access your account for payments first you need to register it here! We will generate encryption keys and save it on the device!
                    This feature relies on cutting edge technology and might not be available for all authenticator devices. Android is not yet supported! Requires IOS17 and Safari 17 or a Yubi key!
                </p>
            </div>
            <div class="flex flex-row justify-center">
                <AddNewAccountPasskeyButton authenticators={props.data.authenticators}></AddNewAccountPasskeyButton>
            </div>
        </div>
    </Layout>
}
