import CopyButton from "../islands/copyButton.tsx";
import { PaymentIntentStatus } from "../lib/enums.ts";
import { ChainIds, networkNameFromId } from "../lib/shared/web3.ts";

export interface PaymentIntentsTableProps {
    paymentIntentData: Array<any>
}

export function getNextPaymentDateDisplay(nextPaymentDate: any) {
    return new Date(nextPaymentDate).toDateString()
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
                                    Amount
                                </th>

                                <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Pricing
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
                                        {getStatusLogo(data.statusText)}
                                    </td>
                                    <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                        <div class="flex items-center gap-x-2">
                                            <div>
                                                <p class="text-xs font-normal text-gray-600 dark:text-gray-400">{data.maxDebitAmount} {currencyName}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{data.pricing}</td>
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

export function RenderIdentifier(id: string) {
    // /?TODO: Copy icon and copy the text
    return <span>{`${id.substring(0, 5)}...${id.substring(id.length - 5, id.length)}`}</span>
}

export function getStatusLogo(status: PaymentIntentStatus | string) {
    switch (status) {
        case PaymentIntentStatus.CREATED:
            return <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-emerald-100/60 dark:bg-gray-800">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <h2 class="text-sm font-normal">Created</h2>
            </div>

        case PaymentIntentStatus.CANCELLED:
            return <div class="inline-flex items-center px-3 py-1 text-red-500 rounded-full gap-x-2 bg-red-100/60 dark:bg-gray-800">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <h2 class="text-sm font-normal">Cancelled</h2>
            </div>
        case PaymentIntentStatus.RECURRING:
            return <div class="inline-flex items-center px-3 py-1 text-gray-500 rounded-full gap-x-2 bg-gray-100/60 dark:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 -960 960 960" width="12"><path d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z" /></svg>

                <h2 class="text-sm font-normal">Recurring</h2>
            </div>

        case PaymentIntentStatus.PAID:
            return <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-emerald-100/60 dark:bg-gray-800">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <h2 class="text-sm font-normal">Paid</h2>
            </div>
        case PaymentIntentStatus.BALANCETOOLOWTORELAY:
            return <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-emerald-100/60 dark:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 -960 960 960" width="12"><path d="M600-160q-134 0-227-93t-93-227q0-134 93-227t227-93q134 0 227 93t93 227q0 134-93 227t-227 93Zm-320-10q-106-28-173-114T40-480q0-110 67-196t173-114v84q-72 25-116 87t-44 139q0 77 44 139t116 87v84Zm320-310Zm0 240q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70Z" /></svg>

                <h2 class="text-sm font-normal">Relayer balance too low</h2>
            </div>
        default:
            return <div></div>
    }

}