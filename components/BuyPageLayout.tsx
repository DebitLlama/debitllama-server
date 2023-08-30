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
        return "";
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
                    <div class="border flex flex-row flex-wrap  p-3 justify-between rounded-xl" style="background-color:white;">
                        <div class="flex flex-col">
                            <span class="p-2 font-light text-xl">{props.item.name}</span>
                            <span class="p-2 font-semibold ">Approved amount: {props.item.maxPrice} {props.item.currency.name}</span>

                            <span class="p-2">{networkName}</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="p-2 font-light font-sans antialiased">{props.item.pricing} {"Priced "} {" Payment"}</span>
                            <span class="p-2 font-sans text-slate-600">Approving {props.item.debitTimes} payment{props.item.debitTimes === 1 ? "" : "s"}</span>
                            <span class="p-2 font-sans text-slate-600">{getDebitIntervalText(props.item.debitInterval, props.item.debitTimes)}</span>
                        </div>
                    </div>
                </div>
                <div class="w-full">
                    {props.children}
                </div>
            </div>
        </div>
    </>
}