
import { useEffect, useState } from 'preact/hooks';

const availableNetworks = ["Ethereum", "BitTorrent Chain"]

const ethereumCurrencies = [{ name: "ETH", native: true }, { name: "USDC", native: false }]

const bittorrentCurrencies = [{ name: "BTTC", native: true }, { name: "USDT", native: false }]

export default function CurrencySelectDropdown() {

    const [selectedNetwork, setSelectedNetwork] = useState(availableNetworks[0]);
    const [selectableCurrencyArray, setSelectableCurrencyArray] = useState(ethereumCurrencies);

    const onSelectNetwork = (event: any) => {
        console.log(event.target.value);
        setSelectedNetwork(event.target.value);
    }

    useEffect(() => {
        if (selectedNetwork === availableNetworks[0]) {
            setSelectableCurrencyArray(ethereumCurrencies)
        } else if (selectedNetwork === availableNetworks[1]) {
            setSelectableCurrencyArray(bittorrentCurrencies);
        }
    }, [selectedNetwork]);

    return <>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="networkSelect">Currency</label>

            <select name="network" id="networkSelect" onChange={onSelectNetwork} class="w-full h-9 rounded-lg">
                {availableNetworks.map((network) => <option value={network}>{network}</option>)}
            </select>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="currencySelect">Currency</label>
            <select name="currency" id={"currencySelect"} class="w-full h-9 rounded-lg">
                {selectableCurrencyArray.map((curr) => <option value={curr.name}>{curr.name} <small>{!curr.native ? "(ERC-20)" : ""}</small>    </option>)}
            </select>

        </div>
    </>
}