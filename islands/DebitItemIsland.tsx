import { PaymentIntentsTableProps, getNextPaymentDateDisplay, getStatusLogo } from "../components/PaymentIntentsTable.tsx";
import { RenderIdentifier } from "../components/components.tsx";

interface DebitItemIsland {
    paymentIntentData: Array<any>
}

export default function DebitItemIsland(props: DebitItemIsland) {
    return <PaymentIntentsTableForDebitItem paymentIntentData={props.paymentIntentData}></PaymentIntentsTableForDebitItem>
}

export function PaymentIntentsTableForDebitItem(props: PaymentIntentsTableProps) {

    function paymentIntentRowClicked() {
        console.log("click")
    }

    return <><div class="flex flex-col w-full p-2">
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
                                    Payments left
                                </th>
                                <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Next payment
                                </th>
                                <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Customer Account Balance
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
                                return <tr class="cursor-pointer bg-white hover:bg-gray-300" onClick={paymentIntentRowClicked}>
                                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                        {RenderIdentifier(data.paymentIntent)}
                                    </td>
                                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                        {getStatusLogo(data.statusText)}
                                    </td>
                                    <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{data.debitTimes - data.used_for}</td>
                                    <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{getNextPaymentDateDisplay(data.nextPaymentDate)}</td>
                                    <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{data.account_id.balance} {data.account_id.currency}</td>
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

