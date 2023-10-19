import { useEffect } from "preact/hooks";
import { NetworkNames, SelectableCurrency, chainIdFromNetworkName, explorerUrl, explorerUrlAddressPath, getCurrenciesForNetworkName } from "../lib/shared/web3.ts";

interface CurrencySelectDropdownProps {
    selectedNetwork: string,
    setSelectedNetwork: (to: string) => void;
    selectableCurrencyArray: SelectableCurrency[]
    setSelectableCurrencyArray: (to: SelectableCurrency[]) => void
    availableNetworks: string[]
    selectedCurrency: SelectableCurrency,
    setSelectedCurrency: (to: SelectableCurrency) => void;
    isWalletConnectPage: boolean
}

export default function CurrencySelectDropdown(props: CurrencySelectDropdownProps) {

    const onSelectNetwork = (event: any) => {
        props.setSelectedNetwork(event.target.value);
    }

    const onSelectCurrency = (event: any) => {
        props.setSelectedCurrency(JSON.parse(event.target.value))
    }
    useEffect(() => {
        let currenciesArray = [];
        if (props.isWalletConnectPage) {
            currenciesArray = getCurrenciesForNetworkName[props.selectedNetwork as NetworkNames].filter((curr) => curr.native === false)
        } else {
            currenciesArray = getCurrenciesForNetworkName[props.selectedNetwork as NetworkNames]
        }

        props.setSelectableCurrencyArray(currenciesArray)
        props.setSelectedCurrency(currenciesArray[0])
    }, [props.selectedNetwork]);

    const chainId = chainIdFromNetworkName[props.selectedNetwork as NetworkNames];
    const explorerURLLink = explorerUrl[chainId] + explorerUrlAddressPath[chainId] + props.selectedCurrency.contractAddress;

    const selectedTokenAddressDisplay = <a
        class="text-indigo-600"
        href={explorerURLLink}
        target="_blank"
    >ERC-20 contract address link</a>

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
                {props.selectableCurrencyArray.map((curr) => {
                    return <option value={JSON.stringify(curr)}>{curr.name} <small>{!curr.native ? "(ERC-20)" : ""}</small>
                    </option>
                })}
            </select>
        </div>
        <div class="mb-4">
            {!props.selectedCurrency.native ? selectedTokenAddressDisplay : null}
        </div>
    </>
}