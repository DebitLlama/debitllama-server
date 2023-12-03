import { useState } from "preact/hooks";
import { DocsLinks } from "../lib/enums.ts";
import { deleteWebhooks, updateWebhookUrl } from "../lib/frontend/fetch.ts";
import { WebhookCheckboxTableRows } from "../components/APiUi.tsx";
import { Tooltip, UnderlinedTd } from "../components/components.tsx";

export interface WebhookSettingsProps {
    webhook_url: string;
    _authorization_: string;
    on_subscription_created: boolean,
    on_subscription_cancelled: boolean,
    on_payment_success: boolean,
    on_payment_failure: boolean,
    on_dynamic_payment_request_rejected: boolean
}

//The data comes from the database with snake_case
//The ui handles data with camelCase
//Then the stored procedure will accept the args with lowercase
// It can be confusing at first, but it helps me differentiate where the data is coming from or goes

export default function WebhooksSettings(props: WebhookSettingsProps) {
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [webhookUrl, setwebhookUrl] = useState(props.webhook_url);
    const [authorization, setAuthorization] = useState(props._authorization_);
    const [onSubscriptionCreated, setOnSubscriptionCreated] = useState(props.on_subscription_created);
    const [onSubscriptionCancelled, setOnSubscriptionCancelled] = useState(props.on_subscription_cancelled);
    const [onPaymentSuccess, setOnPaymentSuccess] = useState(props.on_payment_success);
    const [onPaymentFailure, setOnPaymentFailure] = useState(props.on_payment_failure);
    const [onDynamicPaymentRequestRejected, setOnDynamicPaymentRequestRejected] = useState(props.on_dynamic_payment_request_rejected);

    async function submitWebhookUpdate() {

        setUpdateSuccess(false);

        await updateWebhookUrl(
            {
                webhookurl: webhookUrl,
                _authorization_arg: authorization,
                onsubscriptioncreated: onSubscriptionCreated,
                onsubscriptioncancelled: onSubscriptionCancelled,
                onpaymentsuccess: onPaymentSuccess,
                onpaymentfailure: onPaymentFailure,
                ondynamicpaymentrequestrejected: onDynamicPaymentRequestRejected

            }).then((resp) => {
                if (resp.status === 200) {
                    setUpdateSuccess(true);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })

        return false;
    }

    async function deleteClicked() {
        await deleteWebhooks().then((resp) => {
            window.location.reload();
        })
    }

    function onSubmit(event: any) {
        event.preventDefault();
        return false;
    }

    return <div>
        <div class="mt-10 px-4 mx-auto flex max-w-2xl flex-col justify-center border bg-gradient-to-r from-white via-gray-100 to-white">
            <div class="text-center mt-5">
                <p class="text-xl">Configure a Webhook to get Real Time Updates about Subscriptions!</p>
            </div>
            <form onSubmit={onSubmit}>

                <div class="mb-4 w-full flex flex-row flex-wrap gap-2 justify-between max-w-2xl mx-auto">
                    <div >
                        <label class="block text-gray-700 text-sm font-bold mb-2 w-64" for="url">Webhook URL:</label>
                        <input id="url" required class="p-2 border-2" placeholder={"https://..."} value={webhookUrl} onChange={(event: any) => { setwebhookUrl(event.target.value) }} type="url" name="webhookurl" />
                    </div>
                    {updateSuccess ?
                        <div class="bg-indigo-100 border-t border-b border-indigo-500 text-indigo-700 px-4 py-3 w-64 mt-2 w-full" role="alert">
                            <p class="font-bold">Success</p>
                            <p class="text-sm">The webhook configuration was updated!</p>
                        </div> : <button aria-label="Update webhook link" type="submit" onClick={async () => await submitWebhookUpdate()} class="w-64 mt-2 w-full text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                        >Update Config</button>}
                </div>
            </form>
            <div class="flex flex-row">
                <div >
                </div>
            </div>
            <table class="max-w-2xl w-full mx-auto shadow-lg p-5 border">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="select-none" >Trigger webhook</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <UnderlinedTd extraStyles="flex flex-col justify-between hover:bg-gray-100">
                            <div class="flex flex-row justify-between">
                                <label class="mx-auto w-9/12 cursor-pointer select-none font-bold" for="authheader">Authorization:</label>
                                <input id="autheader" required class="p-2 border-2" placeholder={"Bearer Token"} value={authorization} onChange={(event: any) => { setAuthorization(event.target.value) }} type="text" name="authorization" />
                            </div>
                            <div class="flex flex-row justify-center">
                                <div class="text-sm ">We use the Authorization header in the request. You can add the header value here.</div>
                            </div>
                        </UnderlinedTd>

                    </tr>
                    <WebhookCheckboxTableRows
                        label="On Subscription Created"
                        checkboxName="onsubsciptioncreated"
                        tooltipMessage="Should we trigger your webhook when a new subscription is created?"
                        checked={onSubscriptionCreated}
                        onChange={setOnSubscriptionCreated}
                    ></WebhookCheckboxTableRows>
                    <WebhookCheckboxTableRows
                        label="On Subscription Cancelled"
                        checkboxName="onsubsciptioncancelled"
                        tooltipMessage="Should we trigger your webhook when a subscription is cancelled?"
                        checked={onSubscriptionCancelled}
                        onChange={setOnSubscriptionCancelled}
                    ></WebhookCheckboxTableRows>
                    <WebhookCheckboxTableRows
                        label="On Successful Payment"
                        checkboxName="onsuccessfulpayment"
                        tooltipMessage="Should we trigger your webhook on successful payment?"
                        checked={onPaymentSuccess}
                        onChange={setOnPaymentSuccess}
                    ></WebhookCheckboxTableRows>
                    <WebhookCheckboxTableRows
                        label="On Payment Failure"
                        checkboxName="onpaymentfailure"
                        tooltipMessage="Should we trigger your webhook when a payment fails?"
                        checked={onPaymentFailure}
                        onChange={setOnPaymentFailure}
                    ></WebhookCheckboxTableRows>
                    <WebhookCheckboxTableRows
                        label="If a dynamic payment request fails"
                        checkboxName="ondynamicpaymentrequestfailure"
                        tooltipMessage="Trigger the webhook if a dynamic payment request fails"
                        checked={onDynamicPaymentRequestRejected}
                        onChange={setOnDynamicPaymentRequestRejected}
                    ></WebhookCheckboxTableRows>
                </tbody>
            </table>
            <div class="text-center mb-5">
                <p class="text-lg">Learn more about how the webhooks work from the <a class="text-indigo-800" href={DocsLinks.WEBHOOKDOCS} target="_blank">documentation</a>!</p>
            </div>
            <div class="flex flex-row justify-center">

                <button onClick={async () => await deleteClicked()} class="bg-gray-100 font-small border p-5">Delete Configuration</button>

            </div>
        </div>
    </div>
}

