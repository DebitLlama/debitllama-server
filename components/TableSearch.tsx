import { FilterFor } from "../lib/enums.ts";

interface TableSearchProps {
    tableType: FilterFor;
    searchTerm: string;
    setSearchTerm: (to: string) => void;
    triggerSearch: () => void;
    onEnterSearch: (term: string) => void;
    tableTitle: string;
}
export default function TableSearch(props: TableSearchProps) {

    const onEnterOnly = (e: KeyboardEvent) => {
        if (e.code === "Enter") {
            const searchTerm = document.getElementById("searchTerm") as HTMLInputElement;
            props.onEnterSearch(searchTerm.value);
        }
    }

    const getIdentifierPlaceholder = () => {
        switch (props.tableType) {
            case FilterFor.PaymentIntents:
                return "Search Identifier"
            case FilterFor.DebitItems:
                return "Search Name";
            case FilterFor.RelayerTopupHistory:
                return "Find Transaction Hash"
            case FilterFor.TransactionHistory:
                return "Find Transaction Hash"
            default:
                return "Search";
        }
    }


    return <div class={"flex flex-row flex-wrap mb-4 justify-between gap-2"}>
        {props.tableTitle !== "" ?

            <div class="flex flex-col justify-center">
                <span class="text-lg text-gray-600 text-center">{props.tableTitle}</span>
            </div>
            : null}
        <div class="flex flex-row justify-left">
            <input
                onKeyDown={onEnterOnly}
                value={props.searchTerm}
                onChange={(event: any) => props.setSearchTerm(event.target.value)}
                class="w-64 mr-2 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                type="text" id="searchTerm" name="searchTerm" placeholder={getIdentifierPlaceholder()} 
                />
            <div class="flex flex-row">
                <button
                    aria-label="Search button"
                    id="searchButton"
                    class="mr-2 bg-gradient-to-b text-slate-500 font-semibold from-slate-50 to-slate-100 px-3 py-3 rounded-2xl shadow-slate-400 shadow-md border-b-4 hover border-b border-slate-200 hover:shadow-sm transition-all duration-500"
                    onClick={props.triggerSearch}
                ><SearchIcon></SearchIcon></button>
            </div>
        </div>
    </div>
}


function SearchIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
}