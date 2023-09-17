export default function Overlay(props: {
    show: boolean
}) {
    return <div class={`overlay ${props.show ? "show" : "hide"}`}>
        <div class="flex flex-col justify-center h-full">
            <div class="bg-white w-64 h-32 mx-auto border shadow-md rounded-lg text-center flex flex-col justify-center">
                <h2 class="text-xl">Processing!</h2>
                <h4 class="text-base">Don't refresh the page!</h4>
                <h4 class="text-sm">Check your wallet, we prompted you to sign transactions!</h4>
            </div>
        </div>
    </div>
}