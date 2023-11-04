import { Handlers, PageProps } from "$fresh/server.ts";
import { AccessTokenUIState, UiSwitcherButtons } from "../../../components/APiUi.tsx";
import Layout from "../../../components/Layout.tsx";
import WebhooksSettings from "../../../islands/WebhooksUI.tsx";
import { UpsertWebhookDataArgs, upsert_webhook_data } from "../../../lib/backend/db/rpc.ts";
import { deleteWebhookData, selectWebhooksByUserid } from "../../../lib/backend/db/tables/Webhooks.ts";
import { State } from "../../_middleware.ts";

export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {
        const { data } = await selectWebhooksByUserid(ctx);
        const webhookData = data.length === 0
            ? {
                webhook_url: "",
                _authorization_: "",
                on_subscription_created: false,
                on_subscription_cancelled: false,
                on_payment_success: false,
                on_payment_failure: false,
                on_dynamic_payment_request_rejected: false
            }
            : data[0];

        return ctx.render({ ...ctx.state, webhookData });
    },
    async POST(_req, ctx) {
        const headers = new Headers();
        const json = await _req.json() as UpsertWebhookDataArgs;
        if (!json.webhookurl) {
            return new Response("Missing webhook url", { status: 400, headers });
        }

        let validUrl = undefined;
        try {
            new URL(json.webhookurl);
            validUrl = true;
        } catch (err) {
            validUrl = false;
        }
        if (!validUrl) {
            return new Response("Invalid webhook url", { status: 400, headers });
        }

        if (!checkParameters(json)) {
            return new Response("Invalid parameters", { status: 400, headers });
        }

        await upsert_webhook_data(ctx, json)
        return new Response(null, { status: 200, headers })
    },
    async DELETE(_req, ctx) {
        const { data, error } = await deleteWebhookData(ctx);
        return new Response(null, { status: 200 });
    }
}

function checkParameters(args: UpsertWebhookDataArgs): boolean {
    return (typeof args.onsubscriptioncreated === "boolean" &&
        typeof args.onsubscriptioncancelled === "boolean" &&
        typeof args.onpaymentsuccess === "boolean" &&
        typeof args.onpaymentfailure === "boolean" &&
        typeof args.ondynamicpaymentrequestrejected === "boolean")
}

export default function Webhooks(props: PageProps) {
    const {
        webhook_url,
        _authorization_,
        on_subscription_created,
        on_subscription_cancelled,
        on_payment_success,
        on_payment_failure,
        on_dynamic_payment_request_rejected } = props.data.webhookData;
    return <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
        <div class="container mx-auto py-8">
            <div class={"flex flex-row justify-end"}>
                <UiSwitcherButtons navigateTo={AccessTokenUIState.ACCESSTOKENS} disabled={false} text="Api Access"></UiSwitcherButtons>
                <UiSwitcherButtons navigateTo={AccessTokenUIState.WEBHOOKCONFIG} disabled={true} text="Webhooks"></UiSwitcherButtons>
            </div>
            <WebhooksSettings
                webhook_url={webhook_url}
                _authorization_={_authorization_}
                on_subscription_created={on_subscription_created}
                on_subscription_cancelled={on_subscription_cancelled}
                on_payment_success={on_payment_success}
                on_payment_failure={on_payment_failure}
                on_dynamic_payment_request_rejected={on_dynamic_payment_request_rejected}
            ></WebhooksSettings>
        </div>
    </Layout>
}