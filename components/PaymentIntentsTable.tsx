import { PaymentIntentsTableColNames, PaymentIntentsTablePages, Pricing } from "../lib/enums.ts";
import { TooltipWithTitle, getPaymentIntentStatusLogo } from "./components.tsx";
import {
    formatEther, formatUnits, parseEther, parseUnits
} from "../lib/frontend/web3.ts";
import { ChainIds, getTokenDecimals, networkNameFromId, ZERO_ADDRESS } from "../lib/shared/web3.ts";

export interface PaymentIntentsTablePropWithFilter {
    paymentIntentData: Array<any>
    headerClicked: (at: PaymentIntentsTableColNames) => () => void;
    sortBy: PaymentIntentsTableColNames,
    sortDirection: "ASC" | "DESC",
    forPage: PaymentIntentsTablePages

}

export function getNextPaymentDateDisplay(nextPaymentDate: any) {
    return new Date(nextPaymentDate).toLocaleString()
}

function getCurrencyDecimals(network: string, currencyAddress: string): number {
    if (currencyAddress && currencyAddress !== ZERO_ADDRESS) {
        return getTokenDecimals(network, currencyAddress)
    }
    return 18 // native currency
}

function withPricingSuffix(pricing: string, value: string, currencyName: string) {
    return pricing === Pricing.Fixed
        ? `${value} ${currencyName}`
        : `${value} ${currencyName} Limit`
}

export function getPaymentColValue(
    pricing: string,
    maxDebitAmount: string,
    currencyName: string,
    network: string,
    currencyAddress: string
) {
    const decimals = getCurrencyDecimals(network, currencyAddress)
    const amount = formatUnits(BigInt(maxDebitAmount), decimals)
    return withPricingSuffix(pricing, amount, currencyName)
}



export function getTotalPaymentValue(
    pricing: string,
    maxDebitAmount: string,
    currencyName: string,
    debitTimes: number,
    network: string,
    currencyAddress: string
) {
    if (!Number.isInteger(debitTimes) || debitTimes < 0) {
        throw new Error(`Invalid debitTimes: ${debitTimes}`)
    }
    const decimals = getCurrencyDecimals(network, currencyAddress)
    // const totalInBaseUnits = BigInt(maxDebitAmount) * BigInt(debitTimes)
    const amount = Number.isInteger(Number(maxDebitAmount))
        ? BigInt(maxDebitAmount)
        : parseUnits(String(maxDebitAmount), decimals)
    const totalInBaseUnits = amount * BigInt(debitTimes)
    const total = formatUnits(totalInBaseUnits, decimals)
    return withPricingSuffix(pricing, total, currencyName)
}


// Raw on-chain amounts arrive as integer strings ("20000").
// Human-readable amounts arrive as numbers (0.02) or decimal strings ("0.02").
function toBaseUnits(value: string | number, decimals: number): bigint {
    if (typeof value === "string") {
        const s = value.trim()
        return /^\d+$/.test(s) ? BigInt(s) : parseUnits(s, decimals)
    }
    if (!Number.isFinite(value)) throw new Error(`Invalid amount: ${value}`)
    const s = value.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 })
    return parseUnits(s, decimals)
}

// String(1e-7) === "1e-7", which parseUnits rejects, so avoid exponent notation
function toDecimalString(value: string | number): string {
    if (typeof value === "string") return value.trim()
    if (!Number.isFinite(value)) throw new Error(`Invalid amount: ${value}`)
    return value.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 })
}

function getUrlPath(forPage: PaymentIntentsTablePages) {
    switch (forPage) {
        case PaymentIntentsTablePages.ACCOUNTS:
            return `createdPaymentIntents`;
        case PaymentIntentsTablePages.DEBITITEMS:
            return `payeePaymentIntents`;
        case PaymentIntentsTablePages.ITEM:
            return `payeePaymentIntents`;
        default:
            return ``
    }
}

export function PaymentIntentsTable(props: PaymentIntentsTablePropWithFilter) {
    function paymentIntentRowClicked(paymentIntent: string) {

        return () => location.href = `/app/${getUrlPath(props.forPage)}?q=${paymentIntent}`
    }

    function paymentIntentNameClicked(button_id: string) {
        return () => location.href = `/app/item?q=${button_id}`
    }

    return <><div class="flex flex-col">
        <div class="-my-2 overflow-x-auto">
            <div class="inline-block min-w-full py-2 align-middle">
                <div class="border border-gray-200 dark:border-gray-700 md:rounded-lg">
                    <table class="overflow-auto min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-800 select-none">
                            <tr>
                                {props.forPage === PaymentIntentsTablePages.ITEM ? null : <th tabIndex={1} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right   hover:bg-gray-200">
                                    <div class="flex flex-row justify-between"> Name  <TooltipWithTitle extraStyle="right:-200px;" title=" ?" message={props.forPage === PaymentIntentsTablePages.DEBITITEMS ? `Click on the name to navigate to the item page. If you click on the other fields you will navigate to the payment intent's page!` : "Click on the table row to navigate to the subscription's page!"}></TooltipWithTitle></div>
                                </th>}
                                <th tabIndex={2} onClick={props.headerClicked(PaymentIntentsTableColNames.Status)} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right   hover:bg-gray-200">
                                    <div class="flex flex-row"> Status {getArrows(props.sortDirection, PaymentIntentsTableColNames.Status, props.sortBy)}</div>
                                </th>

                                {props.forPage === PaymentIntentsTablePages.ITEM ? null :
                                    <th tabIndex={3} onClick={props.headerClicked(PaymentIntentsTableColNames.Payment)} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right   hover:bg-gray-200">
                                        <div class="flex flex-row">  Price per Payment {getArrows(props.sortDirection, PaymentIntentsTableColNames.Payment, props.sortBy)}</div>
                                    </th>
                                }
                                {props.forPage === PaymentIntentsTablePages.ITEM ? null :
                                    <th tabIndex={3} onClick={props.headerClicked(PaymentIntentsTableColNames.Payment)} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right   hover:bg-gray-200">
                                        <div class="flex flex-row justify-between">  Total Payment {getArrows(props.sortDirection, PaymentIntentsTableColNames.Payment, props.sortBy)} <TooltipWithTitle extraStyle="right:-200px;" title=" ?" message={"Total is calculated with price per payment * total payments. For dynamic subscriptions this does not reflect the actual total payment, only the maximum limit that approved for spending!"}></TooltipWithTitle></div>
                                    </th>
                                }
                                <th tabIndex={4} onClick={props.headerClicked(PaymentIntentsTableColNames.UsedFor)} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right   hover:bg-gray-200">
                                    <div class="flex flex-row"> Successful Payments {getArrows(props.sortDirection, PaymentIntentsTableColNames.UsedFor, props.sortBy)}</div>
                                </th>
                                {props.forPage === PaymentIntentsTablePages.ITEM ? <th scope="col" class="w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right  ">
                                    Customer Account Balance
                                </th> : null}
                                <th tabIndex={5} onClick={props.headerClicked(PaymentIntentsTableColNames.NextPayment)} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right   hover:bg-gray-200">
                                    <div class="flex flex-row"> Next payment {getArrows(props.sortDirection, PaymentIntentsTableColNames.NextPayment, props.sortBy)}</div>
                                </th>
                                <th tabIndex={6} onClick={props.headerClicked(PaymentIntentsTableColNames.CreatedDate)} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right   hover:bg-gray-200">
                                    <div class="flex flex-row">Created Date {getArrows(props.sortDirection, PaymentIntentsTableColNames.CreatedDate, props.sortBy)}</div>
                                </th>
                                <th tabIndex={6} onClick={props.headerClicked(PaymentIntentsTableColNames.Network)} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right   hover:bg-gray-200">
                                    <div class="flex flex-row">Network{getArrows(props.sortDirection, PaymentIntentsTableColNames.Network, props.sortBy)}</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                            {props.paymentIntentData.map((data) => {
                                const currency = JSON.parse(data.currency);
                                const currencyName = currency.name;
                                const currencyAddress = currency.contractAddress
                                return <tr tabIndex={props.paymentIntentData.indexOf(data) + 7} class="cursor-pointer bg-white hover:bg-gray-100" >
                                    {props.forPage === PaymentIntentsTablePages.ITEM
                                        ? null // Don't show this on the debit item page
                                        : <td onClick={
                                            props.forPage === PaymentIntentsTablePages.DEBITITEMS
                                                ? paymentIntentNameClicked(data.debit_item_id.button_id)
                                                : paymentIntentRowClicked(data.paymentIntent)}
                                            class={`px-4 py-4 text-sm font-medium  whitespace-normal break-words ${props.forPage === PaymentIntentsTablePages.DEBITITEMS ? "border hover:bg-indigo-50" : ""}`}>
                                            {data.debit_item_id.name}
                                        </td>}
                                    <td class="px-4 py-4 text-sm font-medium  whitespace-nowrap" onClick={paymentIntentRowClicked(data.paymentIntent)}>
                                        {getPaymentIntentStatusLogo(data.statusText, "account")}
                                    </td>
                                    {props.forPage === PaymentIntentsTablePages.ITEM ? null :

                                        <td class="px-4 py-4 text-sm   whitespace-nowrap" onClick={paymentIntentRowClicked(data.paymentIntent)}>
                                            <div class="flex items-center gap-x-2">
                                                <div>
                                                    <p class="text-xs font-normal  ">{getPaymentColValue(data.pricing, data.maxDebitAmount, currencyName, data.network, currencyAddress)}</p>
                                                </div>
                                            </div>
                                        </td>}
                                    {props.forPage === PaymentIntentsTablePages.ITEM ? null :

                                        <td class="px-4 py-4 text-sm   whitespace-nowrap" onClick={paymentIntentRowClicked(data.paymentIntent)}>
                                            <div class="flex items-center gap-x-2">
                                                <div>
                                                    <p class="text-xs font-normal  ">{getTotalPaymentValue(data.pricing, data.maxDebitAmount, currencyName, data.debitTimes, data.network, currencyAddress)}</p>
                                                </div>
                                            </div>
                                        </td>}
                                    <td class="px-4 py-4 text-sm   whitespace-nowrap" onClick={paymentIntentRowClicked(data.paymentIntent)}>{data.used_for} / {data.debitTimes}</td>
                                    {props.forPage === PaymentIntentsTablePages.ITEM ? <td class="px-4 py-4 text-sm   whitespace-nowrap">{data.account_id.balance} {currencyName}</td> : null}

                                    <td class="px-4 py-4 text-sm   whitespace-nowrap" onClick={paymentIntentRowClicked(data.paymentIntent)}>{getNextPaymentDateDisplay(data.nextPaymentDate)}</td>
                                    <td class="px-4 py-4 text-sm font-medium  whitespace-nowrap" onClick={paymentIntentRowClicked(data.paymentIntent)}>
                                        {new Date(data.created_at).toLocaleString()}
                                    </td>
                                    <td class="px-4 py-4 text-sm font-medium  whitespace-nowrap" onClick={paymentIntentRowClicked(data.paymentIntent)}>
                                        {networkNameFromId[data.network as ChainIds]}
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    </>
}


function getArrows(direction: "ASC" | "DESC", sortBy: PaymentIntentsTableColNames, currentSortBy: PaymentIntentsTableColNames) {
    if (sortBy !== currentSortBy) {
        return ""
    }
    if (direction === "ASC") {
        return <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style="fill: #6b7280;" d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" /></svg>
    } else {
        return <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style="fill: #6b7280;" d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" /></svg>
    }
}
