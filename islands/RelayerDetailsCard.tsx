import { useState } from 'preact/hooks';
import { NetworkNames, availableNetworks, chainIdFromNetworkName, getRelayerGasTrackerContractAddress, mapNetworkNameToDBColumn, mapNetworkNameToMissingBalanceColumn, walletCurrency } from '../lib/shared/web3.ts';
import { getContract, handleNetworkSelect, parseEther, requestAccounts, topupRelayer } from '../lib/frontend/web3.ts';
import { postRelayerTopup } from '../lib/frontend/fetch.ts';

export interface RelayerDetailsCardProps {
    relayerData: any;
    walletAddress: string;
}


export default function RelayerDetailsCard(props: RelayerDetailsCardProps) {
    const [networkSelected, setNetworkSelected] = useState(availableNetworks[0]);
    const [topUpAmount, setTopupAmount] = useState("0");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


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

        if (address !== props.walletAddress) {
            // Check to make sure you use the wallet that you added in the profiles!
            //Display error if it's not the correct wallet
            setErrorMessage("Your wallet address must match the profile!")
            setShowError(true);
            return;
        }

        const contract = await getContract(
            provider,
            getRelayerGasTrackerContractAddress[chainIdFromNetworkName[networkSelected as NetworkNames]],
            "/RelayerGasTracker.json"
        )

        const tx = await topupRelayer(contract, topUpAmount).catch(err => {
            console.log(err)

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
                    }).then((status: any) => {
                        if (status === 200) {
                            location.reload();
                        } else {
                            setShowError(true);
                            setErrorMessage("An error occured. Contract the tech support!")
                        }
                    })
            } else {
                handleError("Transaction Failed!")
            }
        })


    }

    return <> <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="networkSelect">Network</label>
        <select name="network" id="networkSelect" onChange={onSelectNetwork} class="w-full h-9 rounded-lg">
            {availableNetworks.map((network) => <option value={network}>{network}</option>)}
        </select>
    </div>
        <table class="min-w-full divide-y divide-y-reverse divide-x divide-x-reverse divide-gray-200 dark:divide-gray-700">
            <thead>
                <tr>
                    <th class="w-1/3"></th>
                    <th class="w-2/3"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Balance</td>
                    <td class={"px-4 py-4 text-sm whitespace-nowrap"}>
                        <div class="overflow-x-auto overflowingTableData">
                            <pre class={"text-sm"}>{mapNetworkNameToDBColumn(networkSelected as NetworkNames, props.relayerData)} {walletCurrency[chainIdFromNetworkName[networkSelected as NetworkNames]]}</pre>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr
            class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <div class={"mb-4"}>
            <p class="text-sm text-gray-600">The relayer needs to pay for gas when submitting transactions! Pay for the gas by topping up the relayer!</p>
        </div>
        {IsBalanceMissing(networkSelected as NetworkNames, props.relayerData)}
        <form onSubmit={topupClicked}>
            <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                value={topUpAmount} onChange={(event: any) => setTopupAmount(event.target.value)} type="number" id="amount" name="amount" placeholder="Amount" />
            {showError ? <p class="text-sm text-red-500">{errorMessage}</p> : null}
            <button
                class="mt-2 w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300"
                type="submit">Top Up</button>
        </form>
    </>
}

export function IsBalanceMissing(networkName: NetworkNames, relayerData: any) {
    const missingBalance = mapNetworkNameToMissingBalanceColumn(networkName, relayerData);

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