import { useState } from 'preact/hooks';
import { approveSpend, getAllowance, getContract, handleNetworkSelect, parseEther, requestAccounts, topUpETH, topUpTokens, withdraw } from '../lib/frontend/web3.ts';
import { redirectToAccountPage } from '../lib/frontend/fetch.ts';

export interface AccountTopupOrCloseProps {
    isERC20: boolean,
    chainId: string,
    commitment: string,
    erc20ContractAddress: string,
    debitContractAddress: string,
    accountName: string,
    currencyName: string
    accountClosed: boolean
}

export default function AccountTopupOrClose(props: AccountTopupOrCloseProps) {
    const [amount, setAmount] = useState("");

    const handleError = (err: string) => {
        console.log(err);
    }

    async function handleTokenTopup(contract: any) {
        const topuptx = await topUpTokens(
            contract,
            props.commitment,
            amount
        );

        if (topuptx !== undefined) {
            await topuptx.wait().then((receipt: any) => {
                if (receipt.status === 1) {
                    redirectToAccountPage(props.chainId, props.commitment, props.accountName, props.currencyName)
                }
            })
        }
    }

    async function handleEthTopup(contract: any) {
        const topuptx = await topUpETH(
            contract,
            props.commitment,
            amount
        )
        if (topuptx !== undefined) {
            await topuptx.wait().then((receipt: any) => {
                if (receipt.status === 1) {
                    redirectToAccountPage(props.chainId, props.commitment, props.accountName, props.currencyName)
                }
            })
        }
    }

    async function topupClicked(event: any) {
        event.preventDefault();
        // Submit the top up transaction and then reload this page
        const provider = await handleNetworkSelect(props.chainId, handleError)
        if (!provider) {
            return;
        }
        const address = await requestAccounts();

        if (props.isERC20) {
            const erc20Contract = await getContract(
                provider,
                props.erc20ContractAddress,
                "/ERC20.json");

            const allowance: bigint = await getAllowance(erc20Contract, address, props.debitContractAddress);
            const contract = await getContract(
                provider,
                props.debitContractAddress,
                "/DirectDebit.json");

            if (allowance >= parseEther(amount)) {
                // Just do the top up
                await handleTokenTopup(contract);
            } else {
                // Add allowance and then deposit
                const approveTx = await approveSpend(
                    props.erc20ContractAddress,
                    props.debitContractAddress,
                    amount
                )

                if (approveTx !== undefined) {
                    await approveTx.wait().then(async (receipt: any) => {
                        if (receipt.status === 1) {
                            await handleTokenTopup(contract);
                        }
                    })
                }
            }

        } else {
            const contract = await getContract(
                provider,
                props.debitContractAddress,
                "/DirectDebit.json");

            await handleEthTopup(contract);
        }

    }

    async function withdrawAndClose() {
        const provider = await handleNetworkSelect(props.chainId, handleError)
        if (!provider) {
            return;
        }

        const contract = await getContract(
            provider,
            props.debitContractAddress,
            "/DirectDebit.json");

        const withdrawTx = await withdraw(contract, props.commitment);

        await withdrawTx.wait().then((receipt: any) => {
            if (receipt.status === 1) {
                redirectToAccountPage(
                    props.chainId,
                    props.commitment,
                    props.accountName,
                    props.currencyName
                )
            }
        })
    }

    return <><div class="w-full place-items-start text-left mt-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Add Balance</label>
        <form onSubmit={topupClicked}>
            <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                value={amount} onChange={(event: any) => setAmount(event.target.value)} type="number" id="amount" name="amount" placeholder="Amount" step="any" />
            <button
                class="mt-2 w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300"
                disabled={props.accountClosed}
                type="submit">Top Up</button>
        </form>
    </div>
        <div class="my-6">
            <button
                disabled={props.accountClosed}
                class="mt-2 w-full text-sm font-bold py-2 px-4 rounded-md transition duration-300"
                onClick={withdrawAndClose}
                type="button">Withdraw and Close</button>
        </div></>
}