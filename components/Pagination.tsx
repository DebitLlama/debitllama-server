
interface PaginationButtonsProps {
    previousClicked: () => void;
    previousDisabled: boolean;
    nextClicked: () => void;
    nextDisabled: boolean;
    currentPage: number;
    totalPages: number;
}

export function PaginationButtons(props: PaginationButtonsProps) {
    return <div class="flex items-center justify-between mt-6 mb-5">
        <button onClick={props.previousClicked} disabled={props.previousDisabled} class="disabled:border-white disabled:hover:bg-white  flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900  dark:border-gray-700 dark:hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>

            <span>
                previous
            </span>
        </button>
        <div class={"mx-auto text-center"}>
            {props.currentPage + 1}/{props.totalPages}
        </div>
        <button onClick={props.nextClicked} disabled={props.nextDisabled} href="#" class="disabled:border-white disabled:hover:bg-white	 flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900  dark:border-gray-700 dark:hover:bg-gray-800">
            <span>
                Next
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
        </button>
    </div>
}