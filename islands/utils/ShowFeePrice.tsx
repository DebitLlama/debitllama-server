import { useEffect, useState } from "preact/hooks";
import { getAverageGasLimit, getGasPrice } from "../../lib/backend/businessLogic.ts";
import { ChainIds, networkNameFromId } from "../../lib/shared/web3.ts";

export interface ShowFeePriceProps {
    network: ChainIds,
    currencyName: string,
    currencyAddress: string,
    isNativeCurrency: boolean;
}

export default function ShowFeePrice(props: ShowFeePriceProps) {
    // Get the gasPrice of a network using the chainId

    const [gas, setGas] = useState(0n);
    const networkCurrency = networkNameFromId[props.network]


    useEffect(() => {

        async function setGasPrice() {
            const feeData = await getGasPrice(props.network)
            const gasLimit = getAverageGasLimit();
            const gasPrice = feeData.gasPrice as bigint;
            setGas(gasPrice * gasLimit);
            if (props.isNativeCurrency) {
                // use the native currency
            } else {
                // Use an API for conversion... maybe huobi?
                // TODO: Figure out the conversion endpoints
            }
        }

        setGasPrice()
    }, [props.network, props.currencyAddress]);







    return <div class="flex flex-row justify-center">
        <p>Estimated Gas Fee: ${gas} ${networkCurrency}</p>
        <p></p>
    </div>
}