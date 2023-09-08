import { Pricing } from "../lib/enums.ts";
import { RenderIdentifier, getPaymentIntentStatusLogo } from "./components.tsx";

export interface PaymentIntentsTableProps {
    paymentIntentData: Array<any>
}

export function getNextPaymentDateDisplay(nextPaymentDate: any) {
    return new Date(nextPaymentDate).toDateString()
}

function getPaymentColValue(pricing: string, maxDebitAmount: string, currencyName: string) {
    if (pricing === Pricing.Fixed) {
        return `${maxDebitAmount} ${currencyName}`
    } else {
        return `Maximum ${maxDebitAmount} ${currencyName}`
    }
}

export function PaymentIntentsTableForAccounts(props: PaymentIntentsTableProps) {

    function paymentIntentRowClicked(paymentIntent: string) {
        return () => location.href = `/app/createdPaymentIntents?q=${paymentIntent}`
    }

    return <><div class="flex flex-col">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Identifier
                                </th>
                                <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Status
                                </th>

                                <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Payment
                                </th>
                                <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Payments left
                                </th>
                                <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Next payment
                                </th>
                                <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Created Date
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                            {props.paymentIntentData.map((data) => {
                                const currency = JSON.parse(data.currency);
                                const currencyName = currency.name;
                                return <tr class="cursor-pointer bg-white hover:bg-gray-300" onClick={paymentIntentRowClicked(data.paymentIntent)}>
                                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                        {RenderIdentifier(data.paymentIntent)}
                                    </td>
                                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                        {getPaymentIntentStatusLogo(data.statusText,"account")}
                                    </td>
                                    <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                        <div class="flex items-center gap-x-2">
                                            <div>
                                                <p class="text-xs font-normal text-gray-600 dark:text-gray-400">{getPaymentColValue(data.pricing, data.maxDebitAmount, currencyName)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{data.debitTimes - data.used_for}</td>
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


