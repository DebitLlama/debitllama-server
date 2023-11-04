import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import Layout from "../../components/Layout.tsx";
import AddNewPassKeyButton from "../../islands/AddNewPasskeyButton.tsx";
import { PasskeysAddedNotification } from "../../components/components.tsx";
import { selectAllAuthenticatorsByUserId } from "../../lib/backend/db/tables/Authenticators.ts";

export const handler: Handlers<any, State> = {
  async GET(req, ctx) {
    // It should get the authentication devices count and return it
    const { data } = await selectAllAuthenticatorsByUserId(ctx, {});
    return ctx.render({ ...ctx.state, authenticatorCount: data.length ?? 0 });
  },
};

export default function Passkeys(props: PageProps) {

  const addedPasskeys = props.data.authenticatorCount;
  // TODO: ADD EMAIL 2FA WHEN ADDING A NEW PASSKEY
  return <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
    <div class="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
      <div class="flex flex-row justify-center">
        <h1 class="text-5xl font-bold mb-5">Passkeys</h1>
      </div>

      <div class="flex flex-col justify-center border p-5">
        <PasskeysAddedNotification addedPasskeys={addedPasskeys}></PasskeysAddedNotification>
        <p class="text-lg">Make the checkout process more secure by adding Passkeys for 2FA! You can register a new passkey or remove it after the verification. <strong>If you have added a passkey, the 2FA on the checkout page is active</strong> and you will need to provide a valid passkey to approve subscriptions.</p>
      </div>
      <div class="flex flex-row justify-center">
        <AddNewPassKeyButton></AddNewPassKeyButton>
      </div>
    </div>
  </Layout>
}
