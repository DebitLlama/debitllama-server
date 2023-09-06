import { useState } from 'preact/hooks';
import { availableNetworks } from "../lib/shared/web3.ts";
import { SelectableCurrency, bittorrentCurrencies } from "../lib/frontend/web3.ts";
import CurrencySelectDropdown from './CurrencySelectDropdown.tsx';
import { Pricing } from "../lib/enums.ts";



export const debitPricing = [Pricing.Fixed, Pricing.Dynamic]

interface AddNewDebitItemFormProps {
    creatorAddress: string
}

export default function AddNewDebitItemPageForm(props: AddNewDebitItemFormProps) {
    const [selectedNetwork, setSelectedNetwork] = useState(availableNetworks[0]);
    const [selectableCurrencyArray, setSelectableCurrencyArray] = useState<SelectableCurrency[]>(bittorrentCurrencies);

    const [selectedCurrency, setSelectedCurrency] = useState<SelectableCurrency>(selectableCurrencyArray[0]);


    return <form class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md" method="POST">
        <h1 class="text-2xl font-bold mb-6 text-center">New Debit Item</h1>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="payee">Payee Address</label>
            <pre id={"payee"} class="overflow-hidden text-xs text-gray-700">
                {props.creatorAddress}
            </pre>
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Item Name</label>
            <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                type="text" id="name" name="name" placeholder="" />
        </div>

        <CurrencySelectDropdown
            setSelectedNetwork={setSelectedNetwork}
            selectedNetwork={selectedNetwork}
            selectableCurrencyArray={selectableCurrencyArray}
            setSelectableCurrencyArray={setSelectableCurrencyArray}
            availableNetworks={availableNetworks}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
        ></CurrencySelectDropdown>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="pricing">Pricing</label>

            <select name="pricing" class="w-full h-9 rounded-lg">
                {debitPricing.map((t) => <option value={t}>{t}</option>)}
            </select>
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="maxamount">Debited Amount</label>
            <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                type="number" id="maxamount" name="maxamount" placeholder="0" />
            <p class="text-sm text-gray-600	">For fixed pricing the Debited Amount is the actual amount that will be debited, for the Dynamic pricing the Debited amount is the maximum amount that can be debited. Dynamic subscriptions allow usage based billing. </p>
        </div>
        <div class={"mb-4"}>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="debitTimes">Do many times will you debit the account?</label>
            <input value={"1"} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                type="number" id="debitTimes" name="debitTimes" placeholder="1" />
            <p class="text-sm text-gray-600	">For subscription payments you can set how many times the account will be debited after purchasing this item</p>

        </div>

        <div class={"mb-4"}>

            <label class="block text-gray-700 text-sm font-bold mb-2" for="debitInterval">Do often do you debit the account? (In Days)</label>
            <input value={"0"} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                type="number" id="debitInterval" name="debitInterval" placeholder="" />
            <p class="text-sm text-gray-600	">For subscriptions you can set the interval of days that need to pass before the account can be debited again. To have no limit, leave it at 0, for a monthly subscription you can set it to 30 and debit the amount every 30 days after it was used.</p>
        </div>

        <div class={"mb-4"}>

            <label class="block text-gray-700 text-sm font-bold mb-2" for="redirectto">The URL to redirect to after capturing the payment intent</label>
            <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                type="text" id="redirectto" name="redirectto" placeholder="https://" />

        </div>

        <button
            type="submit"
            class="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
            Save
        </button>
    </form>
}   