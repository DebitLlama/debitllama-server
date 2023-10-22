import type { ComponentChildren } from "preact";
import { ChainIds, networkNameFromId } from "../lib/shared/web3.ts";
import { ExplorerLinkForAddress, Tooltip, UnderlinedTd, getDebitIntervalText, getDebitIntervalTooltipText, getDebitTimesText, getMaxDebitColTitleFromPricing, getSubscriptionTooltipMessage, getTotalPaymentField, getTotalPaymentFieldTooltip } from "./components.tsx";
import { ItemProps } from "../lib/types/checkoutTypes.ts";

interface BuyPagelayoutProps {
    children: ComponentChildren,
    item: ItemProps,
    isLoggedIn: boolean,
}


export default function BuyPageLayout(props: BuyPagelayoutProps) {
    const chainId = props.item.network as ChainIds;
    const networkName = networkNameFromId[chainId];

    return <>
        <div class="md:pr-4 md:pl-4 pb-4 pt-4 mx-auto max-w-screen-lg">
            <div class="flex flex-row flex-wrap gap-2 justify-between">
                <div class="flex flex-col">
                    <div class="text-2xl  ml-1 font-bold flex flex-row">
                        <img src="/logo.svg" width="45" class={"mr-3"} />{" "}
                        <span class="mt-1">Debit</span><span class="text-gray-600 mt-1">Llama</span>
                    </div>
                </div>
                {props.isLoggedIn ?
                    <a
                        href={"/buyitnowlogout?q=" + props.item.buttonId}
                        class="rounded-md bg-gray-200 hover:bg-gray-400 text-lg text-gray-600 hover:text-gray-950 border-gray-500 p-2 ml-1   mr-4 sm:mr-0"
                    >
                        Log out
                    </a> : null}
            </div>
            <div class="flex flex-row flex-wrap shadow-lg rounded-xl mt-3 bg-gradient-gray-to-white ">

                <div class="md:pb-3 md:pl-3 md:pr-3 pt-3 w-full">
                    <div class="text-center"><h1 class="text-2xl font-bold mb-2 text-gray-500 select-none">Secure Checkout</h1></div>
                    <div class="flex rounded-xl bg-white">
                        <table class="table-fixed w-full rounded-xl ">
                            <thead class="bg-gray-200">
                                <tr>
                                    <th class="w-2/6 md:w-2/12"></th>
                                    <th class="w-3/6"></th>
                                    <th class="w-1/6 md:w-1/12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <UnderlinedTd extraStyles="bg-gray-50 text-sm" >Subscription:</UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><p>{props.item.name}</p></UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><Tooltip message="Check the name of the subscription to make sure you are on the right page!"></Tooltip></UnderlinedTd>
                                </tr>
                                <tr>
                                    <UnderlinedTd extraStyles="bg-gray-50 text-sm" >{getMaxDebitColTitleFromPricing(props.item.pricing)}</UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><p> {props.item.maxPrice} {props.item.currency.name} </p>
                                        <small class="text-sm  ">per transaction</small>
                                    </UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><Tooltip message="The maximum amount that can be debited from the account per payment with this subscription!"></Tooltip></UnderlinedTd>
                                </tr>

                                <tr>
                                    <UnderlinedTd extraStyles="bg-gray-50 text-sm">Pricing:</UnderlinedTd>
                                    <UnderlinedTd extraStyles="" ><p> {props.item.pricing}</p></UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><Tooltip message={getSubscriptionTooltipMessage(props.item.pricing)}></Tooltip></UnderlinedTd>
                                </tr>
                                <tr>
                                    <UnderlinedTd extraStyles="bg-gray-50 text-sm" >Debit Times:</UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><p>{getDebitTimesText(props.item.debitTimes)}</p> </UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><Tooltip message="The amount of times this approval lets the payee debit the account!"></Tooltip></UnderlinedTd>
                                </tr>
                                {props.item.debitTimes === 1
                                    ? null
                                    // Only render debit times if the interval is more than 1, else I don't need to show anything here!
                                    : <tr>
                                        <UnderlinedTd extraStyles="bg-gray-50 text-sm">Debit Interval:</UnderlinedTd>
                                        <UnderlinedTd extraStyles=" "><p> {getDebitIntervalText(props.item.debitInterval, props.item.debitTimes)}</p></UnderlinedTd>
                                        <UnderlinedTd extraStyles=""><Tooltip message={getDebitIntervalTooltipText(props.item.debitInterval, props.item.debitTimes)}></Tooltip></UnderlinedTd>
                                    </tr>}
                                <tr>
                                    <UnderlinedTd extraStyles="bg-gray-50 text-sm">Total Payment:</UnderlinedTd>
                                    <UnderlinedTd extraStyles=" "><p> {getTotalPaymentField(
                                        props.item.maxPrice,
                                        props.item.currency.name,
                                        props.item.pricing,
                                        props.item.debitInterval,
                                        props.item.debitTimes)}</p></UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><Tooltip message={getTotalPaymentFieldTooltip(
                                        props.item.maxPrice,
                                        props.item.currency.name,
                                        props.item.pricing,
                                        props.item.debitInterval,
                                        props.item.debitTimes)}></Tooltip></UnderlinedTd>
                                </tr>
                                {props.item.currency.native ? null :
                                    <tr>
                                        <UnderlinedTd extraStyles="bg-gray-50  text-sm" >ERC-20 Contract:</UnderlinedTd>
                                        <UnderlinedTd extraStyles="">
                                            <div class="overflow-x-auto overflowingTableData">
                                                <ExplorerLinkForAddress chainId={chainId} address={props.item.currency.contractAddress}></ExplorerLinkForAddress>
                                            </div>
                                        </UnderlinedTd>
                                        <UnderlinedTd extraStyles=""><Tooltip message="ERC-20 token contract address link to the chain explorer."></Tooltip></UnderlinedTd>
                                    </tr>}
                                <tr>
                                    <UnderlinedTd extraStyles="bg-gray-50  text-sm">Network:</UnderlinedTd>
                                    <UnderlinedTd extraStyles="" ><p>{networkName}</p></UnderlinedTd>
                                    <UnderlinedTd extraStyles=""><Tooltip message="The blockchain network used for paying for this subscription."></Tooltip></UnderlinedTd>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="md:pb-3 md:pl-3 md:pr-3 pt-3 w-full">
                    {props.children}
                </div>
            </div>
        </div>
        <div id="error-display" role="alert" class="sticky bottom-0 w-64 margin_0_auto z-50 hide">
            <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                An Error Occured!
            </div>
            <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                <p id="error-text"></p>
            </div>
        </div>
    </>
}
