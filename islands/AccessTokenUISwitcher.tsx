import { useState } from "preact/hooks";
import { DocsLinks, TokenExpiry } from "../lib/enums.ts";
import AccessTokensTable from "./pagination/AccessTokensTable.tsx";
import WebhooksSettings from "./WebhooksUI.tsx";

export interface AccessTokenUISwitcher {
    data: any
}

enum AccessTokenUIState {
    ACCESSTOKENS,
    WEBHOOKCONFIG
}

function UiSwitcherButtons(props: {
    text: string;
    currentState: AccessTokenUIState;
    navigateTo: AccessTokenUIState;
    setStateTo: () => void;
}) {
    return <button disabled={props.currentState === props.navigateTo} onClick={props.setStateTo} class="disabled:opacity-50 disabled:cursor-not-allowed mx-2 mb-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">{props.text}</button>
}


export default function AccessTokenUISwitcher(props: AccessTokenUISwitcher) {
    const [uiSwitcher, setUiSwitcher] = useState(AccessTokenUIState.ACCESSTOKENS);

    const setUIStateTo = (to: AccessTokenUIState) => () => setUiSwitcher(to);

    function getSelectedUI() {
        switch (uiSwitcher) {
            case AccessTokenUIState.ACCESSTOKENS:
                return <div >
                    <div class="mt-10 px-4 mx-auto flex container flex-col justify-center border bg-gradient-to-r from-white via-gray-100 to-white">
                        <div class="text-center">
                            <p class="text-lg">Generate a Token to Access the REST API</p>
                        </div>

                        <form action="/app/apiAccess" method="POST" class="mb-4 w-full flex flex-row flex-wrap gap-2 justify-evenly">
                            <div >
                                <label class="block text-gray-700 text-sm font-bold mb-2 w-64" for="expiry">Expiry:</label>
                                <select name="expiry" class="w-full h-9 rounded-lg w-64" id="expiry">
                                    <option value={TokenExpiry.ONEMONTH} >One Month</option>
                                    <option value={TokenExpiry.SIXMONTHS} >Six Months</option>
                                    <option value={TokenExpiry.ONEYEAR} >One Year</option>
                                </select>
                            </div>
                            <button type="submit" class=" w-64 mt-2 w-full text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                            >Get New Token</button>
                        </form>
                        <div class="text-center">
                            <p class="text-lg">Learn more about how to use the Api from the <a class="text-indigo-800" href={DocsLinks.APIDOCS} target="_blank">documentation</a>!</p>
                        </div>
                    </div>

                    <section class="mt-10 mx-auto container">
                        {props.data.accesstokens.length === 0
                            ? <div>No access tokens</div>
                            : <AccessTokensTable
                                accesstokens={props.data.accesstokens}
                                totalPages={props.data.totalPages}
                            ></AccessTokensTable>}
                    </section>
                </div>
            case AccessTokenUIState.WEBHOOKCONFIG:
                return <WebhooksSettings webhook_url={props.data.webhook_url}></WebhooksSettings>
            default:
                return null;
        }
    }

    return <div class="container mx-auto py-8">
        <div class={"flex flex-row justify-end"}>
            <UiSwitcherButtons navigateTo={AccessTokenUIState.ACCESSTOKENS} setStateTo={setUIStateTo(AccessTokenUIState.ACCESSTOKENS)} currentState={uiSwitcher} text="Api Access"></UiSwitcherButtons>
            <UiSwitcherButtons navigateTo={AccessTokenUIState.WEBHOOKCONFIG} setStateTo={setUIStateTo(AccessTokenUIState.WEBHOOKCONFIG)} currentState={uiSwitcher} text="Webhooks"></UiSwitcherButtons>
        </div>
        {getSelectedUI()}
    </div>

}