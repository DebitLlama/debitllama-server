import { formatTxHash } from "../components/components.tsx";
import { ChainIds, getChainExplorerForChainId, walletCurrency } from "../lib/shared/web3.ts";

export interface RelayedTxHistoryProps {
    paymentIntentHistory: any;
}

export default function RelayedTxHistory(props: RelayedTxHistoryProps) {
    function onRowClicked(url: string) {
        return () => {
            window.open(url, "_blank")
        }
    }

    return <div class="inline-block min-w-full py-2 ">
        <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
            <div class={"flex flex-row justify-center"}>
                <h4 class="mx-auto text-gray-500 dark:text-gray-40">Transaction History</h4>
            </div>


            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            Transaction
                        </th>
                        <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            Date
                        </th>

                        <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            Gas Used
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {props.paymentIntentHistory.map((data: any) => {
                        return <tr class="cursor-pointer bg-white hover:bg-gray-300" onClick={onRowClicked(getChainExplorerForChainId(data.network, data.transactionHash))}>
                            <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                {formatTxHash(data.submittedTransaction)}
                            </td>
                            <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                {new Date(data.created_at).toLocaleString()}
                            </td>
                            <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                <div class="flex items-center gap-x-2">
                                    <div>
                                        <p class="text-xs font-normal text-gray-600 dark:text-gray-400">{data.allGasUsed} {walletCurrency[data.network as ChainIds]}</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    </div>
}