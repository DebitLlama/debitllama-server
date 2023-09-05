import { ShorthandPropertyAssignment } from "https://deno.land/x/ts_morph@17.0.1/ts_morph.js";
import { ChainIds, getChainExplorerForChainId, networkNameFromId, walletCurrency } from "../lib/shared/web3.ts";

export interface RelayerTopupHistoryProps {
    topUpHistoryData: Array<any>
}

export default function RelayerTopupHistory(props: RelayerTopupHistoryProps) {
    function onRowClicked(url: string) {
        return () => {
            window.open(url, "_blank")
        }
    }
    return <div>
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        Date
                    </th>
                    <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        Amount
                    </th>
                    <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        Network                    </th>
                    <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        Transaction
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                {props.topUpHistoryData.map((data) => {
                    return <tr class="cursor-pointer bg-white hover:bg-gray-300" onClick={onRowClicked(getChainExplorerForChainId(data.network, data.transactionHash))}>
                        <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            {new Date(data.created_at).toLocaleString()}
                        </td>
                        <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            {data.Amount} {walletCurrency[data.network as ChainIds]}
                        </td>
                        <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{networkNameFromId[data.network as ChainIds]}</td>
                        <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {formatTxHash(data.transactionHash)}
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
    </div>
}

function formatTxHash(tx: string) {
    return `${tx.substring(0, 5)}...${tx.substring(tx.length - 5, tx.length)}`
}