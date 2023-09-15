import { useState } from 'preact/hooks';
import Overlay from "../components/Overlay.tsx";
import { approveSpend, disconnectWallet, getContract, handleNetworkSelect, requestAccounts } from "../lib/frontend/web3.ts";
import { ChainIds } from '../lib/shared/web3.ts';
import { redirectToAccountsPage } from '../lib/frontend/fetch.ts';

export interface WalletApproveOrDisconnectProps {
    chainId: ChainIds,
    erc20ContractAddress: string,
    debitContractAddress: string,
    accountClosed: boolean,
    commitment: string
}

export default function WalletApproveOrDisconnect(props: WalletApproveOrDisconnectProps) {
    const [showOverlay, setShowOverlay] = useState(false);
    const [approveAmount, setApproveAmount] = useState("");

    const handleError = (err: string) => {
        console.log(err);
    }


    async function approveClicked(event: any) {
        event.preventDefault();

        const provider = await handleNetworkSelect(props.chainId, handleError)
        if (!provider) {
            return;
        }
        const address = await requestAccounts();
        const erc20Contract = await getContract(
            provider,
            props.erc20ContractAddress,
            "/ERC20.json");

        const approveTx = await approveSpend(
            erc20Contract,
            props.debitContractAddress,
            approveAmount
        );

        if (approveTx !== undefined) {
            await approveTx.wait().then(async (receipt: any) => {
                if (receipt.status === 1) {
                    location.reload();
                }
            })
        }
    }

    async function disconnectAccount() {
        const provider = await handleNetworkSelect(props.chainId, handleError)
        if (!provider) {
            return;
        }

        const contract = await getContract(
            provider,
            props.debitContractAddress,
            "/ConnectedWallets.json"
        )
        setShowOverlay(true);
        const disconnectTx = await disconnectWallet(
            contract,
            props.commitment,
        ).catch(err => {
            setShowOverlay(false);
            console.log(err)
        })
        if (disconnectTx !== undefined) {
            await disconnectTx.wait().then((receipt: any) => {
                if (receipt.status === 1) {
                    redirectToAccountsPage();
                } else {
                    setShowOverlay(false)
                }
            }).catch((err: any) => {
                setShowOverlay(false);
            })
        }

    }

    return <>
        <div class="w-full place-items-start text-left mt-2">
            <Overlay show={showOverlay}></Overlay>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Allowance:</label>
            <form onSubmit={approveClicked} class="flex flex-row justofy-between flex-wrap gap-2"
            >
                <input required class="max-w-lg px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    value={approveAmount} onChange={(event: any) => setApproveAmount(event.target.value)} type="number" id="amount" name="amount" placeholder="Amount" step="any" />
                <button
                    class="max-w-md bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300"
                    disabled={props.accountClosed}
                    type="submit">Approve Spend</button>
            </form>
        </div>
        <div class="mb-4">
            <p class="text-sm text-gray-400">You need to approve spend to use the account. </p>

        </div>
        <div class="my-6 text-center">
            <button
                disabled={props.accountClosed}
                class="mx-auto mt-2 max-w-md text-sm font-bold py-2 px-4 rounded-md transition duration-300"
                onClick={disconnectAccount}
                type="button">Disconnect Account</button>
        </div>
    </>
}