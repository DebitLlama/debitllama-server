
import { useEffect, useState } from 'preact/hooks';
import { SelectableCurrency } from './accountCreatePageForm.tsx';


interface CurrencySelectDropdownProps {
    selectedNetwork: string,
    setSelectedNetwork: (to: string) => void;
    selectableCurrencyArray: SelectableCurrency[]
    setSelectableCurrencyArray: (to: SelectableCurrency[]) => void
    availableNetworks: string[]
    selectedCurrency: SelectableCurrency,
    setSelectedCurrency: (to: SelectableCurrency) => void;

}

export default function CurrencySelectDropdown(props: CurrencySelectDropdownProps) {


    const onSelectNetwork = (event: any) => {
        props.setSelectedNetwork(event.target.value);
    }

    const onSelectCurrency = (event: any) => {
        props.setSelectedCurrency(JSON.parse(event.target.value))
    }

    // useEffect(() => {
    //     if (selectedNetwork === availableNetworks[0]) {
    //         setSelectableCurrencyArray(ethereumCurrencies)
    //     } else if (selectedNetwork === availableNetworks[1]) {
    //         setSelectableCurrencyArray(bittorrentCurrencies);
    //     }
    // }, [selectedNetwork]);

    return <>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="networkSelect">Network</label>

            <select name="network" id="networkSelect" onChange={onSelectNetwork} class="w-full h-9 rounded-lg">
                {props.availableNetworks.map((network) => <option value={network}>{network}</option>)}
            </select>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="currencySelect">Currency</label>
            <select onChange={onSelectCurrency} name="currency" id={"currencySelect"} class="w-full h-9 rounded-lg">
                {props.selectableCurrencyArray.map((curr) => <option value={JSON.stringify(curr)}>{curr.name} <small>{!curr.native ? "(ERC-20)" : ""}</small></option>)}
            </select>
        </div>
    </>
}