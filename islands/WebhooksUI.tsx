import { useState } from "preact/hooks";
import { DocsLinks } from "../lib/enums.ts";
import { updateWebhookUrl } from "../lib/frontend/fetch.ts";

export interface WebhookSettingsProps {
    webhook_url: string
}

export default function WebhooksSettings(props: WebhookSettingsProps) {
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [inputValue, setInputValue] = useState(props.webhook_url);

    async function onSubmitWebhookUpdate(event: any) {
        event.preventDefault();
        setUpdateSuccess(false);
        const formData = new FormData(event.target);
        const webhook_url = formData.get("webhookurl") as string;
        await updateWebhookUrl({ webhook_url }).then((resp) => {
            setUpdateSuccess(true);
            setTimeout(() => {
                location.href = location.href;
            }, 1000);
        })

        return false;
    }

    return <div>
        <div class="mt-10 px-4 mx-auto flex container flex-col justify-center border bg-gradient-to-r from-white via-gray-100 to-white">
            <div class="text-center">
                <p class="text-lg">Configure a Webhook to get Real Time Updates about Payment Intents!</p>
            </div>
            <form onSubmit={onSubmitWebhookUpdate} class="mb-4 w-full flex flex-row flex-wrap gap-2 justify-evenly">
                <div >
                    <label class="block text-gray-700 text-sm font-bold mb-2 w-64" for="expiry">Webhook:</label>
                    <input class="p-2 border-2" placeholder={"https://..."} value={inputValue} onChange={(event: any) => { setInputValue(event.target.value) }} type="url" name="webhookurl" />
                </div>
                {updateSuccess ?
                    <div class="bg-indigo-100 border-t border-b border-indigo-500 text-indigo-700 px-4 py-3 w-64 mt-2 w-full" role="alert">
                        <p class="font-bold">Success</p>
                        <p class="text-sm">The webhook url was updated!</p>
                    </div> : <button type="submit" class="w-64 mt-2 w-full text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                    >Update Webhook</button>}
            </form>

            <div class="text-center">
                <p class="text-lg">Learn more about how the webhooks work from the <a class="text-indigo-800" href={DocsLinks.WEBHOOKDOCS} target="_blank">documentation</a>!</p>
            </div>
        </div>
    </div>
}