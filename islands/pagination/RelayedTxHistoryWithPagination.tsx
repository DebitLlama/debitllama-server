import { PaginationButtons } from "../../components/Pagination.tsx";
import TableSearch from "../../components/TableSearch.tsx";
import { formatTxHash } from "../../components/components.tsx";
import { FilterFor, RelayerTxHistoryColNames } from "../../lib/enums.ts";
import { fetchPaginatedTxHistory, fetchPaginatedTxHistoryByPaymentIntentId } from "../../lib/frontend/fetch.ts";
import { ChainIds, getChainExplorerForChainId, walletCurrency } from "../../lib/shared/web3.ts";
import { useEffect, useState } from "preact/hooks";

export interface RelayedTxHistoryProps {
    txHistory: any;
    totalPages: number;
    searchBy: "user_id" | "paymentIntent_id",
    paymentIntent_id: number | undefined
}
//TODO: for dynamic payments the history should show the actual amount debited! and the max amount too!

export default function RelayedTxHistory(props: RelayedTxHistoryProps) {
    const [currentTxHistoryData, setCurrentTxHistoryData] = useState<Array<any>>(props.txHistory);
    const [pageData, setPageData] = useState({
        currentPage: 0,
        totalPages: props.totalPages
    })

    //Search should be triggered by a button! 
    const [searchTerm, setSearchTerm] = useState("");

    const [sortBy, setSortBy] = useState<RelayerTxHistoryColNames>(RelayerTxHistoryColNames.Date);

    // When the currently selected orderBy is clicked twice I change the order by!
    const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

    const fetchData = async (currentPage: number, searchTerm: string) => {
        if (props.searchBy === "user_id") {
            const res = await fetchPaginatedTxHistory({
                currentPage,
                searchTerm,
                sortBy,
                sortDirection
            })
            if (res.status === 200) {
                const json = await res.json();
                setCurrentTxHistoryData(json.data)
                setPageData({
                    currentPage: json.currentPage,
                    totalPages: json.totalPages
                })
            }
        } else {
            // by paymentIntent_id
            const res = await fetchPaginatedTxHistoryByPaymentIntentId({
                paymentIntent_id: props.paymentIntent_id as number,
                currentPage,
                searchTerm,
                sortBy,
                sortDirection
            })
            if (res.status === 200) {
                const json = await res.json();
                setCurrentTxHistoryData(json.data)
                setPageData({
                    currentPage: json.currentPage,
                    totalPages: json.totalPages
                })
            }
        }


    }
    const previousClicked = async () => {
        if (pageData.currentPage !== 0) {
            await fetchData(pageData.currentPage - 1, "");
        }
    }

    const nextClicked = async () => {
        if (pageData.currentPage !== pageData.totalPages - 1) {
            await fetchData(pageData.currentPage + 1, "");
        }
    }

    useEffect(() => {
        fetchData(pageData.currentPage, "");
    }, [sortBy, sortDirection])


    async function triggerSearch() {
        await fetchData(0, searchTerm);
    }
    async function onEnterSearch(term: string) {
        setSearchTerm(term);
        await fetchData(0, term);
    }

    function headerClicked(clickedOn: RelayerTxHistoryColNames) {
        return () => {
            if (clickedOn === sortBy) {
                if (sortDirection === "ASC") {
                    setSortDirection("DESC")
                } else {
                    setSortDirection("ASC")
                }
            } else {
                setSortBy(clickedOn);
            }
        }
    }



    function onRowClicked(url: string) {
        return () => {
            window.open(url, "_blank")
        }
    }
    return <div class={`${props.txHistory.length === 0 || props.txHistory === null ? "" : "overflow-auto"} md:rounded-lg`}>

        <TableSearch
            tableType={FilterFor.TransactionHistory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            triggerSearch={triggerSearch}
            onEnterSearch={onEnterSearch}
        ></TableSearch>

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
                        Payment Amount
                    </th>
                    <th scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        Gas Used
                    </th>

                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                {currentTxHistoryData.map((data: any) => {
                    return <tr class="cursor-pointer bg-white hover:bg-gray-300" onClick={onRowClicked(getChainExplorerForChainId(data.network, data.submittedTransaction))}>
                        <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            {formatTxHash(data.submittedTransaction)}
                        </td>
                        <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            {new Date(data.created_at).toLocaleString()}
                        </td>
                        <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            {data.paymentAmount}{" "}{JSON.parse(data.paymentCurrency).name}
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
        <PaginationButtons
            currentPage={pageData.currentPage}
            totalPages={pageData.totalPages}
            nextClicked={nextClicked}
            nextDisabled={pageData.currentPage === pageData.totalPages - 1}
            previousClicked={previousClicked}
            previousDisabled={pageData.currentPage === 0}
        ></PaginationButtons>
    </div>
}