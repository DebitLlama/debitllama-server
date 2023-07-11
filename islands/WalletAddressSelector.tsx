
import { isEthereumUndefined, redirectToMetamask, requestAccounts } from "../lib/frontend/web3.ts";

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
        class="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
        type="button">
        Connect Wallet
    </button>
}