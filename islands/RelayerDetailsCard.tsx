import { useState } from 'preact/hooks';
import { NetworkNames, availableNetworks, chainIdFromNetworkName, getRelayerGasTrackerContractAddress, mapNetworkNameToDBColumn, mapNetworkNameToMissingBalanceColumn, walletCurrency } from '../lib/shared/web3.ts';
import { getContract, handleNetworkSelect, parseEther, requestAccounts, topupRelayer } from '../lib/frontend/web3.ts';
import { postRelayerTopup } from '../lib/frontend/fetch.ts';
import Overlay from '../components/Overlay.tsx';

export interface RelayerDetailsCardProps {
    relayerData: any;
}


export default function RelayerDetailsCard(props: RelayerDetailsCardProps) {
    const [networkSelected, setNetworkSelected] = useState(availableNetworks[0]);
    const [topUpAmount, setTopupAmount] = useState("0");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlayError, setShowOverlayError] = useState({
        showError: false,
        message: "",
        action: () => setShowOverlay(false)
    })


    const onSelectNetwork = (event: any) => {
        setNetworkSelected(event.target.value);
        setTopupAmount("0");
    }

    function handleError(msg: string) {
        setShowError(true);
        setErrorMessage(msg)
    }


    async function topupClicked(event: any) {
        event.preventDefault();
        setShowError(false)
        // I will submit the top up transaction, save the new balance using the API and then reload the page!

        const provider = await handleNetworkSelect(chainIdFromNetworkName[networkSelected as NetworkNames], handleError)
        if (!provider) {
            return;
        }
        const address = await requestAccounts();


        const contract = await getContract(
            provider,
            getRelayerGasTrackerContractAddress[chainIdFromNetworkName[networkSelected as NetworkNames]],
            "/RelayerGasTracker.json"
        )
        setShowOverlay(true)
        setShowOverlayError({ ...showOverlayError, showError: false, message: "" })

        const tx = await topupRelayer(contract, topUpAmount).catch(err => {
            console.log(err)
            setShowOverlayError({ ...showOverlayError, showError: true, message: "Unable to top up relayer!" })
            handleError("Unable to submit transaction!")
        });

        if (tx === undefined || tx === null) {
            return;
        }
        await tx.wait().then(async (receipt: any) => {
            if (receipt.status === 1) {
                // I need to send the tx id to the server and refresh the page!
                await postRelayerTopup(
                    {
                        chainId: chainIdFromNetworkName[networkSelected as NetworkNames],
                        transactionHash: receipt.hash,
                        blockNumber: receipt.blockNumber,
                        from: receipt.from,
                        amount: topUpAmount
                    }).catch((err) => {
                        setShowError(true);
                        setErrorMessage("An error occured. Contract the tech support! ErrorMessage:" + err.message)
                        setShowOverlayError({ ...showOverlayError, showError: true, message: "An error occured when updating the relayer. Contact support!" })

                    }).then((status: any) => {
                        if (status === 200) {
                            location.reload();
                        } else {
                            setShowError(true);
                            setErrorMessage("An error occured. Contract the tech support!")
                        }
                    })
            } else {
                setShowOverlayError({ ...showOverlayError, showError: true, message: "Transaction failed!" })

            }
        })
    }

    return <> <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="networkSelect">Network</label>
        <select name="network" id="networkSelect" onChange={onSelectNetwork} class="w-full h-9 rounded-lg">
            {availableNetworks.map((network) => <option value={network}>{network}</option>)}
        </select>
    </div>
        <Overlay show={showOverlay} error={showOverlayError}></Overlay>
        <table class="min-w-full divide-y divide-y-reverse divide-x divide-x-reverse divide-gray-200 dark:divide-gray-700">
            <thead>
                <tr>
                    <th class="w-1/3"></th>
                    <th class="w-2/3"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500  whitespace-nowrap"}>Balance</td>
                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}>
                        <div class="overflow-x-auto overflowingTableData">
                            <pre class={"text-sm"}>{parseFloat(mapNetworkNameToDBColumn(networkSelected as NetworkNames, props.relayerData)).toFixed(4)} {walletCurrency[chainIdFromNetworkName[networkSelected as NetworkNames]]}</pre>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr
            class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <div class={"mb-4"}>
            <p class="text-sm ">The relayer needs to pay for gas when submitting transactions! Pay for the gas by topping up the relayer!</p>
        </div>
        {IsBalanceMissing(networkSelected as NetworkNames, props.relayerData)}
        <form onSubmit={topupClicked}>
            <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                value={topUpAmount} onChange={(event: any) => setTopupAmount(event.target.value)} type="number" id="amount" name="amount" placeholder="Amount" step="any" />
            {showError ? <p class="text-sm text-red-500">{errorMessage}</p> : null}
            <button
                class="mt-2 w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300"
                type="submit">Top Up</button>
        </form>
    </>
}

export function IsBalanceMissing(networkName: NetworkNames, relayerData: any) {
    const missingBalance = mapNetworkNameToMissingBalanceColumn(networkName, relayerData);
    if (missingBalance === "") {
        return null;
    }
    if (parseEther(missingBalance) !== BigInt("0")) {
        return <div class={`mb-4 border-solid border-2 border-red-600 flex flex-col justify-center`}>
            <div><h4 class="text-xl mx-auto text-center">{"Missing Balance"}</h4></div>
            <p class="p-5 text-center">The Relayer is missing balance and can't relay transactions!</p>
            <p class="p-5 text-center">Top up the Relayer with at least {missingBalance} {walletCurrency[chainIdFromNetworkName[networkName as NetworkNames]]}</p>
        </div>
    } else {
        return null;
    }
}