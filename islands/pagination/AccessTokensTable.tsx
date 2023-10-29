import { useState } from "preact/hooks";
import { deleteAccessToken, fetchPaginatedAccessTokens } from "../../lib/frontend/fetch.ts";
import { PaginationButtons } from "../../components/Pagination.tsx";
import ShowAndHideContent from "../utils/ShowAndContent.tsx";

interface AccessTokensTableProps {
    accesstokens: Array<any>,
    totalPages: number,
    toHighlightId: string,
}

export default function AccessTokensTable(props: AccessTokensTableProps) {
    const [currentAccessTokens, setCurrentAccessTokens] = useState<Array<any>>(props.accesstokens);
    const [pageData, setPageData] = useState({
        currentPage: 0,
        totalPages: props.totalPages
    })
    const [sortBy, setSortBy] = useState<string>("created_at");

    // When the currently selected orderBy is clicked twice I change the order by!
    const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

    const fetchData = async (currentPage: number, searchTerm: string) => {
        const res = await fetchPaginatedAccessTokens({
            currentPage,
            sortDirection
        })
        if (res.status === 200) {
            const json = await res.json();
            console.log(json)
            setCurrentAccessTokens(json.data)
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

    function headerClicked(clickedOn: "created_at") {
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

    async function onDeleteSubmit(event: any) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const accesstoken = formData.get("accesstoken") as string;
        await deleteAccessToken({ accesstoken }).then(() => {
            // no mistake here buddy, this will refresh the page without replaying a POST request
            // deno-lint-ignore no-self-assign
            location.href = location.href;
        }).catch(err => {

        })
        return false;
    }

    function highlightRow(id: number) {
        if (id.toString() === props.toHighlightId) {
            return "bg-indigo-100"
        } else {
            return ""
        }
    }

    if (props.accesstokens.length === 0 || props.accesstokens === null) {
        return <div class="flex flex-col">
            <div class="flex flex-row justify-center mb-4">
                <h4 class="text-xl">Nothing to show</h4>
            </div>
        </div>

    } else {
        return <div>
            <div class=" -my-2 overflow-x-auto">
                <div class="inline-block min-w-full py-2 align-middle">
                    <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-50 dark:bg-gray-800 select-none">
                                <tr>
                                    <th onClick={headerClicked("created_at")} tabIndex={8} scope="col" class="cursor-pointer w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right   hover:bg-gray-200">
                                        Created Date
                                    </th>
                                    <th tabIndex={1} scope="col" class="cursor-pointer w-1/12 px-4 py-3.5 text-sm font-normal text-left rtl:text-right  hover:bg-gray-200">
                                        Valid
                                    </th>

                                    <th tabIndex={2} scope="col" class="cursor-pointer w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right   hover:bg-gray-200">
                                        Access Token
                                    </th>


                                    <th tabIndex={3} scope="col" class="cursor-pointer w-1/6 px-4 py-3.5 text-sm font-normal text-left rtl:text-right   hover:bg-gray-200">
                                        Expiry Date
                                    </th>
                                    <th tabIndex={4} scope="col" class="cursor-pointer w-1/12 px-4 py-3.5 text-sm font-normal text-left rtl:text-right   hover:bg-gray-200">
                                        Delete
                                    </th>

                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                {currentAccessTokens.map((d: any) => <tr class={highlightRow(d.id)}>
                                    <td class="px-4 py-4 text-sm   whitespace-nowrap">{new Date(d.created_at).toLocaleString()}</td>
                                    <td class="px-4 py-4 text-sm   whitespace-nowrap">
                                        {getValidIcon(d.expiry_date_utc)}
                                    </td>
                                    <td class="px-4 py-4 text-sm   whitespace-nowrap"><ShowAndHideContent content={d.access_token}></ShowAndHideContent></td>
                                    <td class="px-4 py-4 text-sm   whitespace-nowrap">{new Date(d.expiry_date_utc).toLocaleString()}</td>
                                    <td class="px-4 py-4 text-sm   whitespace-nowrap">
                                        <form onSubmit={onDeleteSubmit}>
                                            <input name="accesstoken" type="hidden" value={d.access_token} />
                                            <button aria-label={"Delete Access token "} class="rounded-full bg-gray-50 hover:bg-gray-100 p-4 shadow-lg">
                                                <svg fill={"currentColor"} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                                            </button>
                                        </form>
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <PaginationButtons
                currentPage={pageData.currentPage}
                totalPages={pageData.totalPages}
                nextClicked={nextClicked}
                nextDisabled={pageData.currentPage === pageData.totalPages - 1}
                previousClicked={previousClicked}
                previousDisabled={pageData.currentPage === 0}
            ></PaginationButtons>
        </div>;
    }
}

export function getValidIcon(expiryDate: string) {
    const isValid = new Date() < new Date(new Date(expiryDate).toLocaleString());

    let icon;
    let color;

    if (isValid) {
        icon = <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" /></svg>
        color = "text-indigo-400"
    } else {
        icon = <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" /></svg>
        color = "textred-700";
    }

    return <div class={color}>{icon}</div>
}