import { PaginationButtons } from "../../components/Pagination.tsx";
import { useEffect, useState } from "preact/hooks";
import { FilterFor, PaymentIntentsTableColNames, PaymentIntentsTablePages } from "../../lib/enums.ts";
import TableSearch from "../../components/TableSearch.tsx";
import { HourglassLoader } from "../../components/loadingIndicators.tsx";
import { PaymentIntentsTable } from "../../components/PaymentIntentsTable.tsx";
import { fetchPaginatedPaymentIntentsForDebitItems } from "../../lib/frontend/fetch.ts";


export default function PaymentIntentsPaginationForDebitItemsPage() {
    const [currentPaymentIntents, setCurrentPaymentIntents] = useState<Array<any>>([])
    const [pageData, setPageData] = useState({
        currentPage: 0,
        totalPages: 0
    });
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    //Search should be triggered by a button! 
    const [searchTerm, setSearchTerm] = useState("");

    const [sortBy, setSortBy] = useState<PaymentIntentsTableColNames>(PaymentIntentsTableColNames.CreatedDate);

    // When the currently selected orderBy is clicked twice I change the order by!
    const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

    const fetchData = async (currentPage: number, searchTerm: string) => {
        const res = await fetchPaginatedPaymentIntentsForDebitItems({
            currentPage,
            searchTerm,
            sortBy,
            sortDirection
        })
        if (res.status === 200) {
            const json = await res.json();
            setCurrentPaymentIntents(json.paymentIntentsRows)
            setPageData({
                currentPage: json.currentPage,
                totalPages: json.totalPages
            })

        } else {
            setErrorMessage("Unable to reach the servers!")
            setShowError(true);
        }
        setTimeout(() => setShowLoadingIndicator(false), 1000)
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
        // I show loading indicator only when the  page loads first time
        setShowError(false);
        setShowLoadingIndicator(true);

        fetchData(pageData.currentPage, "");
    }, [])

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

    function headerClicked(clickedOn: PaymentIntentsTableColNames) {
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


    return <>
        {showLoadingIndicator ? <HourglassLoader /> : <>
            <h1 class="text-2xl font-bold mb-5 text-center text-gray-500">Payment Intents</h1>

            <TableSearch
                tableType={FilterFor.PaymentIntents}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                triggerSearch={triggerSearch}
                onEnterSearch={onEnterSearch}
            ></TableSearch>
            <PaymentIntentsTable
                headerClicked={headerClicked}
                paymentIntentData={currentPaymentIntents}
                sortBy={sortBy}
                sortDirection={sortDirection}
                forPage={PaymentIntentsTablePages.DEBITITEMS}

            ></PaymentIntentsTable>
            <PaginationButtons
                currentPage={pageData.currentPage}
                totalPages={pageData.totalPages}
                nextClicked={nextClicked}
                nextDisabled={pageData.currentPage === pageData.totalPages - 1}
                previousClicked={previousClicked}
                previousDisabled={pageData.currentPage === 0}
            ></PaginationButtons>
        </>}
        {showError ? <p class="text-sm text-red-500">{errorMessage}</p> : null}
    </>
}
