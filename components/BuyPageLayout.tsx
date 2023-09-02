import type { ComponentChildren } from "preact";
import { ItemProps } from "../islands/buyButtonPage.tsx";
import { debitPricing } from "../islands/addNewDebitItemPageForm.tsx";
import { Head } from "$fresh/runtime.ts";
import { ChainIds, networkNameFromId } from "../lib/shared/web3.ts";

interface BuyPagelayoutProps {
    children: ComponentChildren,
    item: ItemProps,
    isLoggedIn: boolean,
    // triggerSnackbar: boolean
}


function isDynamic(pricing: string) {
    return pricing === debitPricing[1];
}

function getDebitIntervalText(debitInterval: number, debitTimes: number) {
    if (debitTimes === 1) {
        return "Unspecified";
    }
    if (debitInterval === 0) {
        return "Unspecified"
    }

    if (debitInterval === 1) {
        return "The payment can be withdrawn every day"
    }

    return `The payment can be withdrawn only every ${debitInterval} days`

}

export default function BuyPageLayout(props: BuyPagelayoutProps) {

    const networkName = networkNameFromId[props.item.network as ChainIds];
    return <>
        <Head>
            <title>DebitLlama</title>
            <link rel="stylesheet" href="/styles.css" />
            <script src="/zxcvbn.js"></script>
            <script src="/directdebit_bundle.js"></script>
        </Head>
        <div class="p-4 mx-auto max-w-screen-md">
            <div class="flex flex-row justify-between">
                <div class="flex flex-col">
                    <div class="text-2xl  ml-1 font-bold flex flex-row">
                        <img src="/logo.svg" width="45" class={"mr-3"} />{" "}
                        <span class="mt-1">Debit</span><span class="text-gray-600 mt-1">Llama</span>
                    </div>
                </div>
                {props.isLoggedIn ?
                    <a
                        href={"/buyitnowlogout?q=" + props.item.buttonId}
                        class="text-lg text-gray-500 hover:text-gray-700 py-1 border-gray-500"
                    >
                        Logout
                    </a> : null}
            </div>
            <div class="flex flex-row flex-wrap shadow-lg rounded-xl mt-3">
                <div class="p-3 w-full"  >

                    <div class="text-center"><h1 class="text-2xl font-bold mb-2">Checkout</h1></div>
                    <div class="flex p-3 rounded-xl" style="background-color:white;">
                        <table class="table-fixed w-full">
                            <thead>
                                <tr> <th></th>
                                    <th></th>
                                    <th></th></tr>

                            </thead>
                            <tbody>
                                <tr>
                                    <UnderlinedTd extraStyles="text-slate-400 dark:text-slate-200 text-sm" >Subscription:</UnderlinedTd>
                                    <UnderlinedTd extraStyles="font-semibold">{props.item.name}</UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><Tooltip message="The name of subscription"></Tooltip></UnderlinedTd>
                                </tr>
                                <tr>
                                    <UnderlinedTd extraStyles="text-slate-400 dark:text-slate-200 text-sm" >Approved Payment:</UnderlinedTd>
                                    <UnderlinedTd extraStyles="font-semibold" >{props.item.maxPrice} {props.item.currency.name}</UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><Tooltip message="The maximum amount that can be debited from the account"></Tooltip></UnderlinedTd>
                                </tr>
                                <tr>
                                    <UnderlinedTd extraStyles="text-slate-400 dark:text-slate-200 text-sm">Network:</UnderlinedTd>
                                    <UnderlinedTd extraStyles="font-semibold" >{networkName}</UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><Tooltip message="The network used for this payment"></Tooltip></UnderlinedTd>
                                </tr>
                                <tr>
                                    <UnderlinedTd extraStyles="text-slate-400 dark:text-slate-200 text-sm">Pricing:</UnderlinedTd>
                                    <UnderlinedTd extraStyles="font-semibold" >{props.item.pricing}</UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><Tooltip message={getSubscriptionTooltipMessage(props.item.pricing)}></Tooltip></UnderlinedTd>
                                </tr>
                                <tr>
                                    <UnderlinedTd extraStyles="text-slate-400 dark:text-slate-200 text-sm" >Debit Times:</UnderlinedTd>
                                    <UnderlinedTd extraStyles="font-semibold">{props.item.debitTimes} payment{props.item.debitTimes === 1 ? "" : "s"}</UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><Tooltip message="The amount of times this approval lets the payee debit the account"></Tooltip></UnderlinedTd>
                                </tr>
                                <tr>
                                    <UnderlinedTd extraStyles="text-slate-400 dark:text-slate-200 text-sm">Debit Interval (Days):</UnderlinedTd>
                                    <UnderlinedTd extraStyles="font-semibold">{getDebitIntervalText(props.item.debitInterval, props.item.debitTimes)}</UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><Tooltip message="The amount of days that needs to pass before the account can be debited again, counted from the last payment date"></Tooltip></UnderlinedTd>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="w-full">
                    {props.children}
                </div>
            </div>
        </div>
    </>
}

function getSubscriptionTooltipMessage(pricing: string) {
    if (pricing === "Fixed") {
        return "Fixed priced subscriptions will always debit the approved amount."
    } else {
        return "Metered subscriptions have dynamic pricing where the approved amount represents a maximum";
    }
}

interface TooltipProps {
    message: string
}

function Tooltip(props: TooltipProps) {
    return <div class="tooltip">
        ?
        <span aria-label="Tooltip helptext" class="tooltiptext">{props.message}</span>
    </div>
}

interface UnderlinedTdProps {
    children: ComponentChildren
    extraStyles: string
}

function UnderlinedTd(props: UnderlinedTdProps) {
    return <td class={`${props.extraStyles} border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400`}>{props.children}</td>
}