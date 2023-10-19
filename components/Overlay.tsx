export type OverlayError = {
    message: string;
    action: () => void;
    showError: boolean;
}

export default function Overlay(props: {
    show: boolean,
    error: OverlayError
}) {
    const processing = <div class="p-10 bg-white w-64  mx-auto border shadow-md rounded-lg text-center flex flex-col justify-center">
        <h2 class="text-xl">Processing!</h2>
        <h4 class="text-base">Don't refresh the page!</h4>
        <h4 class="text-sm">Check your wallet, we prompted you to sign transactions!</h4>
    </div>
    const error = <div class="p-10 bg-white w-64  mx-auto border shadow-md rounded-lg text-center flex flex-col justify-center">
        <h2 class="text-xl">An Error Occured!</h2>
        <h4 class="text-base">{props.error.message}</h4>
        <button type={"button"} onClick={props.error.action} class=" mx-auto mt-2 w-full text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-lg text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Ok</button>
    </div>

    return <div class={`overlay ${props.show ? "show" : "hide"}`}>
        <div class="flex flex-col justify-center h-full mb-5">
            {props.error.showError ? error : processing}
        </div>
    </div>
}