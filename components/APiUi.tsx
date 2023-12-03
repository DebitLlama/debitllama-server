import { RadioButtonChecked, RadioButtonUnchecked, Tooltip, UnderlinedTd } from "./components.tsx";

export enum AccessTokenUIState {
    ACCESSTOKENS = "/app/manage_api/rest",
    WEBHOOKCONFIG = "/app/manage_api/webhooks"
}

export function UiSwitcherButtons(props: {
    text: string;
    navigateTo: AccessTokenUIState | string;
    disabled: boolean
}) {
    return <form action={props.navigateTo} method="GET"><button
        aria-label="switch between access token and webhook tab"
        disabled={props.disabled}
        href={props.navigateTo}
        class="disabled:opacity-50 disabled:cursor-not-allowed mx-2 mb-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
        {props.text}</button></form>
}


export function WebhookCheckboxTableRows(props: {
    label: string,
    checkboxName: string,
    tooltipMessage: string,
    checked: boolean,
    onChange: (checked: boolean) => void
}) {

    return <tr class={`bg-white cursor-pointer`} onClick={() => props.onChange(!props.checked)}>
        <UnderlinedTd extraStyles="flex flex-row justify-between hover:bg-gray-50">
            <div>
                {props.checked ? <RadioButtonChecked></RadioButtonChecked> : <RadioButtonUnchecked></RadioButtonUnchecked>}
            </div>
            <div class="w-9/12">
                <label class="mx-auto cursor-pointer select-none" for={props.checkboxName}>{props.label}
                </label>
            </div>
            <div class="w-8">
                <Tooltip message={props.tooltipMessage}></Tooltip>
            </div>

        </UnderlinedTd>
    </tr>
}