import { ChainIds, getChainExplorerForChainId, networkNameFromId, walletCurrency } from "../../lib/shared/web3.ts";
import { formatTxHash } from "../../components/components.tsx";
import { useEffect, useState } from "preact/hooks";
import { FilterFor, RelayerTopupHistoryColNames } from "../../lib/enums.ts";
import { fetchPaginatedRelayerTopupHistory } from "../../lib/frontend/fetch.ts";
import TableSearch from "../../components/TableSearch.tsx";
import { PaginationButtons } from "../../components/Pagination.tsx";

export interface RelayerTopupHistoryProps {
    topUpHistoryData: Array<any>,
    totalPages: number
}

export default function RelayerTopupHistory(props: RelayerTopupHistoryProps) {
    const [currentTopupHistoryData, setCurrentTopupHistoryData] = useState<Array<any>>(props.topUpHistoryData);
    const [pageData, setPageData] = useState({
        currentPage: 0,
        totalPages: props.totalPages
    })

    //Search should be triggered by a button! 
    const [searchTerm, setSearchTerm] = useState("");

    const [sortBy, setSortBy] = useState<RelayerTopupHistoryColNames>(RelayerTopupHistoryColNames.Date);

    // When the currently selected orderBy is clicked twice I change the order by!
    const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");


    const fetchData = async (currentPage: number, searchTerm: string) => {
        const res = await fetchPaginatedRelayerTopupHistory({
            currentPage,
            searchTerm,
            sortBy,
            sortDirection
        })
        if (res.status === 200) {
            const json = await res.json();
            setCurrentTopupHistoryData(json.data)
            setPageData({
                currentPage: json.currentPage,
                totalPages: json.totalPages
            })
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

    function headerClicked(clickedOn: RelayerTopupHistoryColNames) {
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

    return <div class={`${props.topUpHistoryData.length === 0 || props.topUpHistoryData === null ? "" : "overflow-auto"}  md:rounded-lg`}>
        <TableSearch
            tableType={FilterFor.RelayerTopupHistory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            triggerSearch={triggerSearch}
            onEnterSearch={onEnterSearch}
            tableTitle=""
        ></TableSearch>
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th onClick={headerClicked(RelayerTopupHistoryColNames.Date)} tabIndex={1} scope="col" class="cursor-pointer w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hover:bg-gray-200">
                        Date
                    </th>
                    <th onClick={headerClicked(RelayerTopupHistoryColNames.Amount)} tabIndex={2} scope="col" class="cursor-pointer w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hover:bg-gray-200">
                        Amount
                    </th>
                    <th onClick={headerClicked(RelayerTopupHistoryColNames.Network)} tabIndex={3} scope="col" class="cursor-pointer w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hover:bg-gray-200">
                        Network                    </th>
                    <th tabIndex={4} scope="col" class="w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        Transaction
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                {currentTopupHistoryData.map((data) => {
                    return <tr tabIndex={currentTopupHistoryData.indexOf(data) + 5} class="cursor-pointer bg-white hover:bg-gray-300" onClick={onRowClicked(getChainExplorerForChainId(data.network, data.transactionHash))}>
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
