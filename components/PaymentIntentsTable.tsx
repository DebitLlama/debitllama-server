import { PaymentIntentsTableColNames, PaymentIntentsTablePages, Pricing } from "../lib/enums.ts";
import { RenderIdentifier, getPaymentIntentStatusLogo } from "./components.tsx";

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

function getPaymentColValue(pricing: string, maxDebitAmount: string, currencyName: string) {
    if (pricing === Pricing.Fixed) {
        return `${maxDebitAmount} ${currencyName}`
    } else {
        return `Maximum ${maxDebitAmount} ${currencyName}`
    }
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

    return <><div class="flex flex-col">
        <div class="-my-2 overflow-x-auto">
            <div class="inline-block min-w-full py-2 align-middle">
                <div class="border border-gray-200 dark:border-gray-700 md:rounded-lg">
                    <table class="overflow-auto min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-800 select-none">
                            <tr>
                                <th tabIndex={1} onClick={props.headerClicked(PaymentIntentsTableColNames.Identifier)} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hover:bg-gray-200">
                                    <div class="flex flex-row"> Identifier {getArrows(props.sortDirection, PaymentIntentsTableColNames.Identifier, props.sortBy)}</div>
                                </th>
                                <th tabIndex={2} onClick={props.headerClicked(PaymentIntentsTableColNames.Status)} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hover:bg-gray-200">
                                    <div class="flex flex-row"> Status {getArrows(props.sortDirection, PaymentIntentsTableColNames.Status, props.sortBy)}</div>
                                </th>
                                {PaymentIntentsTablePages.ITEM ? null :
                                    <th tabIndex={3} onClick={props.headerClicked(PaymentIntentsTableColNames.Payment)} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hover:bg-gray-200">
                                        <div class="flex flex-row">  Amount {getArrows(props.sortDirection, PaymentIntentsTableColNames.Payment, props.sortBy)}</div>
                                    </th>
                                }
                                <th tabIndex={4} onClick={props.headerClicked(PaymentIntentsTableColNames.DebitTimes)} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hover:bg-gray-200">
                                    <div class="flex flex-row"> Payments Left{getArrows(props.sortDirection, PaymentIntentsTableColNames.DebitTimes, props.sortBy)}</div>
                                </th>

                                <th tabIndex={5} onClick={props.headerClicked(PaymentIntentsTableColNames.UsedFor)} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hover:bg-gray-200">
                                    <div class="flex flex-row"> Successful Payments {getArrows(props.sortDirection, PaymentIntentsTableColNames.UsedFor, props.sortBy)}</div>
                                </th>
                                {props.forPage === PaymentIntentsTablePages.ITEM ? <th scope="col" class="w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Customer Account Balance
                                </th> : null}
                                <th tabIndex={6} onClick={props.headerClicked(PaymentIntentsTableColNames.NextPayment)} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hover:bg-gray-200">
                                    <div class="flex flex-row"> Next payment {getArrows(props.sortDirection, PaymentIntentsTableColNames.NextPayment, props.sortBy)}</div>
                                </th>
                                <th tabIndex={7} onClick={props.headerClicked(PaymentIntentsTableColNames.CreatedDate)} scope="col" class="cursor-pointer w-32 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hover:bg-gray-200">
                                    <div class="flex flex-row">Created Date {getArrows(props.sortDirection, PaymentIntentsTableColNames.CreatedDate, props.sortBy)}</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                            {props.paymentIntentData.map((data) => {
                                const currency = JSON.parse(data.currency);
                                const currencyName = currency.name;
                                return <tr tabIndex={props.paymentIntentData.indexOf(data) + 7} class="cursor-pointer bg-white hover:bg-gray-300" onClick={paymentIntentRowClicked(data.paymentIntent)}>
                                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                        {RenderIdentifier(data.paymentIntent)}
                                    </td>
                                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                        {getPaymentIntentStatusLogo(data.statusText, "account")}
                                    </td>
                                    {PaymentIntentsTablePages.ITEM ? null :

                                        <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                            <div class="flex items-center gap-x-2">
                                                <div>
                                                    <p class="text-xs font-normal text-gray-600 dark:text-gray-400">{getPaymentColValue(data.pricing, data.maxDebitAmount, currencyName)}</p>
                                                </div>
                                            </div>
                                        </td>}
                                    <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{data.debitTimes}</td>
                                    <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{data.used_for}</td>

                                    {props.forPage === PaymentIntentsTablePages.ITEM ? <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{data.account_id.balance} {data.account_id.currency}</td> : null}

                                    <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{getNextPaymentDateDisplay(data.nextPaymentDate)}</td>
                                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                        {new Date(data.created_at).toLocaleString()}
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
