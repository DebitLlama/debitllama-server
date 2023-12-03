import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../../_middleware.ts";
import Layout from "../../../components/Layout.tsx";
import { PasskeysAddedNotification } from "../../../components/components.tsx";
import { selectAllAuthenticatorsByUserId } from "../../../lib/backend/db/tables/Authenticators.ts";
import { UiSwitcherButtons } from "../../../components/APiUi.tsx";
import AddNew2FAPassKeyButton from "../../../islands/AddNew2FAPasskeyButton.tsx";

export const handler: Handlers<any, State> = {
  async GET(req, ctx) {
    // It should get the authentication devices count and return it
    const { data } = await selectAllAuthenticatorsByUserId(ctx, {});
    return ctx.render({ ...ctx.state, authenticatorCount: data.length ?? 0 });
  },
};

export default function TwoFaPasskeys(props: PageProps) {

  const addedPasskeys = props.data.authenticatorCount;
  return <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
    <div class="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center border p-5">
      <div class="flex flex-row justify-end">
        <UiSwitcherButtons
          text="2FA"
          navigateTo="/app/webauthn/2fa"
          disabled={true}
        ></UiSwitcherButtons>
        <UiSwitcherButtons
          text="Accounts"
          navigateTo="/app/webauthn/accounts"
          disabled={false}
        ></UiSwitcherButtons>
      </div>
      <div class="flex flex-row justify-center">
        <h1 class="text-5xl font-bold mb-5">2 FA Passkeys</h1>
      </div>

      <div class="flex flex-col justify-center ">
        <PasskeysAddedNotification addedPasskeys={addedPasskeys}></PasskeysAddedNotification>
        <p class="text-lg">Make the checkout process more secure by adding Passkeys for 2FA! You can register a new passkey or remove it after the verification. <strong>If you have added a passkey, the 2FA on the checkout page is active</strong> and you will need to provide a valid passkey to approve subscriptions. Passkey 2FA works with all account types!</p>
      </div>
      <div class="flex flex-row justify-center">
        <AddNew2FAPassKeyButton></AddNew2FAPassKeyButton>
      </div>
    </div>
  </Layout>
}
