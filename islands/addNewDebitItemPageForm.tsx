import { useState } from 'preact/hooks';
import { SelectableCurrency, availableNetworks, bittorrentCurrencies } from "../lib/shared/web3.ts";
import CurrencySelectDropdown from './CurrencySelectDropdown.tsx';
import { DocsLinks, Pricing } from "../lib/enums.ts";
import WalletAddressSelector from "./WalletAddressSelector.tsx";

export const debitPricing = [Pricing.Fixed, Pricing.Dynamic]

interface AddNewDebitItemFormProps {
    creatorAddress: string
}

export default function AddNewDebitItemPageForm(props: AddNewDebitItemFormProps) {
    const [selectedNetwork, setSelectedNetwork] = useState(availableNetworks[0]);
    const [selectableCurrencyArray, setSelectableCurrencyArray] = useState<SelectableCurrency[]>(bittorrentCurrencies);

    const [selectedCurrency, setSelectedCurrency] = useState<SelectableCurrency>(selectableCurrencyArray[0]);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const onformSubmit = (e: any) => {
        e.preventDefault();
        setShowError(false);
        const form = document.getElementById("itemForm") as HTMLFormElement;
        const elements = form.elements;

        //@ts-ignore accessing elements via string name is a valid way to do it
        const debitInterval = elements["debitInterval"]
        //@ts-ignore accessing elements via string name is a valid way to do it
        const pricing = elements["pricing"]


        if (pricing.value === Pricing.Fixed && debitInterval.value < 1) {
            debitInterval.setCustomValidity("Invalid interval. Fixed priced payments are automaticly processed, they must be specified. For a monthly subscription set this to 30.");
            setShowError(true);
            setErrorMessage("Invalid Interval")
            return false;
        }


        form.submit();
        return true;
    }


    return <form id="itemForm" class="w-full mx-auto bg-white p-8 rounded-md shadow-md border" method="POST" onSubmit={onformSubmit}>
        <h1 class="text-2xl font-bold mb-6 text-center">New Debit Item</h1>

        <div class="flex flex-row flex-wrap justify-around flex-gap 4">

            <div>
                <div class="relative mb-4 flex flex-wrap items-stretch">
                    <span
                        class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
                        id="basic-addon1"
                    ><WalletAddressSelector /></span>
                    <input
                        type="text"
                        class="relative m-0 block min-w-0 flex-auto rounded-r border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                        placeholder="Wallet Address"
                        aria-label="Wallet Address"
                        aria-describedby="basic-addon1"
                        name="walletaddress"
                        required
                        id="walletAddressInput"
                    />
                </div>
                <div class="mb-4 max-w-sm">
                    <p class="text-sm text-gray-600	">Add the wallet address that will receive the funds.</p>
                </div>
                <div class="mb-4 max-w-sm">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Item Name</label>
                    <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        minLength={3} type="text" id="name" name="name" placeholder="" />
                </div>
                <div class="mb-4 max-w-sm">
                    <p class="text-sm text-gray-600	">The name of the item will be the name of the subscription on the Checkout page!</p>
                </div>
                <div class="max-w-sm mb-4">
                    <CurrencySelectDropdown
                        setSelectedNetwork={setSelectedNetwork}
                        selectedNetwork={selectedNetwork}
                        selectableCurrencyArray={selectableCurrencyArray}
                        setSelectableCurrencyArray={setSelectableCurrencyArray}
                        availableNetworks={availableNetworks}
                        selectedCurrency={selectedCurrency}
                        setSelectedCurrency={setSelectedCurrency}
                        isWalletConnectPage={false}
                    ></CurrencySelectDropdown>
                    <p class="text-sm text-gray-600	">Select the network and the currency you want to use for the subscription payments!</p>

                </div>
                <div class="mb-4 max-w-sm">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="pricing">Pricing</label>

                    <select name="pricing" class="w-full h-9 rounded-lg">
                        {debitPricing.map((t) => <option value={t}>{t}</option>)}
                    </select>
                </div>
                <div class="mb-4 max-w-sm">
                    <p class="text-sm text-gray-600	">Fixed priced subscriptions are processed automaticly while dynamic subscriptions must be triggered manually or via API.</p>
                </div>
                <div class="mb-4 max-w-sm">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="maxamount">Price Per Payment</label>
                    <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        type="number" id="maxamount" name="maxamount" placeholder="0" step="any" />
                </div>
                <div class="mb-4 max-w-sm">
                    <p class="text-sm text-gray-600	">For fixed pricing the price per payment is the actual amount that will be debited, for the Dynamic pricing it's the maximum limit that can be debited. Dynamic subscriptions allow usage based billing with a spend limit. </p>
                </div>
            </div>

            <div>
                <div class={"mb-4 max-w-sm"}>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="debitTimes">How many times will you debit the account?</label>
                    <input min={1} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        type="number" id="debitTimes" name="debitTimes" placeholder="1" />
                </div>
                <div class="mb-4 max-w-sm">
                    <p class="text-sm text-gray-600	">You can set how many times the account will be debited after creating the payment intent</p>
                </div>
                <div class={"mb-4 max-w-sm"}>

                    <label class="block text-gray-700 text-sm font-bold mb-2" for="debitInterval">Do often do you debit the account? (In Days)</label>
                    <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        type="number" id="debitInterval" name="debitInterval" placeholder="30" />
                </div>
                <div class={"mb-4 max-w-sm"}>
                    <p class="text-sm text-gray-600	">You can set the interval of days that need to pass before the account can be debited again. For a monthly subscription you can set it to 30 and debit the account every 30 days.The account can be debited on the day the subscription was made and then after that the days are always counted from the last payment date! If the customer account is empty or the relayer has insufficient gas, the payment interval will be delayed! If you leave it at 0 you can debit the account any time but you must use dynamic pricing and trigger it manually or through the Rest API!</p>
                </div>

                <div class={"mb-4 max-w-sm"}>

                    <label class="block text-gray-700 text-sm font-bold mb-2" for="redirectto">The URL to redirect to after capturing the payment intent</label>
                    <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        type="url" id="redirectto" name="redirectto" placeholder="https://" />
                </div>
                <div class={"mb-4 max-w-sm"}>
                    <p class="text-sm text-gray-600	">You can find more information about capturing a payment with your website in the <a class="text-sm text-indigo-600" href={DocsLinks.REDIRECTURLSPEC} target="_blank">Documentation</a>!</p>
                </div>
                <div class="max-w-sm mx-auto">
                    <div class={"mb-4 max-w-sm"}>
                        <p class="text-sm text-gray-600	">The Debit Item parameters are final and can't be edited. But you can deactivate the debit item and create a new one any time!</p>
                    </div>
                    <button
                        aria-label="save button"
                        type="submit"
                        class="w-64 text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                        Save
                    </button>
                    <div class={"mb-4 text-left  mt-4"}>
                        {showError ? <p class="text-sm text-red-500">{errorMessage}</p> : null}
                    </div>
                </div>
            </div>
        </div>



    </form>
}   