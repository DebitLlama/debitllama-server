
import { isEthereumUndefined, redirectToMetamask, requestAccounts } from "../lib/web3frontend.ts";

// if window.ethereum is undefined it should open metamask's page to prompt download 
export default function WalletAddressSelector() {

    async function onSelectorClicked() {
        const web3Undefined = isEthereumUndefined();
        if (web3Undefined) {
            redirectToMetamask();
        } else {
            const address = await requestAccounts();
            const walletAddressInput = document.getElementById("walletAddressInput") as HTMLInputElement;
            walletAddressInput.value = address;
        }
    }

    return <button
        onClick={onSelectorClicked}
        class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button">
        Connect Wallet
    </button>
}