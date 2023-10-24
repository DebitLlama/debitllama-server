import { useState } from 'preact/hooks';
import { approveSpend, getAllowance, getContract, handleNetworkSelect, parseEther, requestAccounts, topUpETH, topUpTokens, withdraw } from '../lib/frontend/web3.ts';
import { redirectToAccountPage, redirectToAccountsPage, requestBalanceRefresh } from '../lib/frontend/fetch.ts';
import Overlay from '../components/Overlay.tsx';

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

//This is only for virtual accounts!

export default function AccountTopupOrClose(props: AccountTopupOrCloseProps) {
    const [amount, setAmount] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlayError, setShowOverlayError] = useState({
        showError: false,
        message: "",
        action: () => setShowOverlay(false)
    })


    const handleError = (err: string) => {
        console.log(err);
    }

    async function handleTokenTopup(contract: any) {
        const topuptx = await topUpTokens(
            contract,
            props.commitment,
            amount
        ).catch((err) => {
            setShowOverlayError({ ...showOverlayError, showError: true, message: "Unable to top up tokens!" })
        });

        if (topuptx !== undefined) {
            await topuptx.wait().then(async (receipt: any) => {
                if (receipt.status === 1) {

                    const status = await requestBalanceRefresh(props.commitment, props.chainId, "app")

                    if (status === 200) {
                        redirectToAccountPage(props.commitment)
                    }
                    else {
                        console.log("An error occured with saving the account!");
                        setShowOverlayError({ ...showOverlayError, showError: true, message: "An error occured wile saving the account!" })
                    }
                } else {
                    setShowOverlayError({ ...showOverlayError, showError: true, message: "Transaction failed!" })

                }
            }).catch((err: any) => {
                setShowOverlayError({ ...showOverlayError, showError: true, message: "Transaction failed!" })
            })
        }
    }

    async function handleEthTopup(contract: any) {

        const topuptx = await topUpETH(
            contract,
            props.commitment,
            amount
        ).catch(err => {
            setShowOverlayError({ ...showOverlayError, showError: true, message: "Transaction failed!" })
        })
        if (topuptx !== undefined) {
            await topuptx.wait().then(async (receipt: any) => {
                if (receipt.status === 1) {

                    const status = await requestBalanceRefresh(props.commitment, props.chainId, "app")

                    if (status === 200) {
                        redirectToAccountPage(props.commitment)
                    }
                    else {
                        setShowOverlayError({ ...showOverlayError, showError: true, message: "An error occured wile saving the account!" })
                    }
                } else {
                    setShowOverlayError({ ...showOverlayError, showError: true, message: "Transaction failed!" })

                }
            }).catch((err: any) => {
                setShowOverlayError({ ...showOverlayError, showError: true, message: "Transaction failed!" })
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
        setShowOverlay(true)
        setShowOverlayError({ ...showOverlayError, showError: false, message: "" })

        if (props.isERC20) {
            const erc20Contract = await getContract(
                provider,
                props.erc20ContractAddress,
                "/ERC20.json").catch((err: any) => {
                    setShowOverlayError({ ...showOverlayError, showError: true, message: "Unable to connect to ERC20 contract!" })
                });

            const allowance: bigint = await getAllowance(erc20Contract, address, props.debitContractAddress).catch((err: any) => {
                setShowOverlayError({ ...showOverlayError, showError: true, message: "Unable to fetch token allowance!" })
            });;
            const contract = await getContract(
                provider,
                props.debitContractAddress,
                "/VirtualAccounts.json").catch((err: any) => {
                    setShowOverlayError({ ...showOverlayError, showError: true, message: "Unable to connect to smart contract!" })
                });;

            if (allowance >= parseEther(amount)) {
                // Just do the top up
                await handleTokenTopup(contract).catch((err: any) => {
                    setShowOverlayError({ ...showOverlayError, showError: true, message: "Token top up error!" })
                });;
            } else {
                // Add allowance and then deposit
                const approveTx = await approveSpend(
                    erc20Contract,
                    props.debitContractAddress,
                    amount
                ).catch((err: any) => {
                    setShowOverlayError({ ...showOverlayError, showError: true, message: "Unable to approve spend!" })
                });

                if (approveTx !== undefined) {
                    await approveTx.wait().then(async (receipt: any) => {
                        if (receipt.status === 1) {
                            await handleTokenTopup(contract).catch((err: any) => {
                                setShowOverlayError({ ...showOverlayError, showError: true, message: "Transaction failed!" })
                            });;
                        }
                    }).catch((err: any) => {
                        setShowOverlayError({ ...showOverlayError, showError: true, message: "Unable to approve spend!" })
                    });
                }
            }

        } else {
            const contract = await getContract(
                provider,
                props.debitContractAddress,
                "/VirtualAccounts.json").catch((err: any) => {
                    setShowOverlayError({ ...showOverlayError, showError: true, message: "Unable to connect to contract!" })
                });;

            await handleEthTopup(contract).catch((err: any) => {
                setShowOverlayError({ ...showOverlayError, showError: true, message: "Top up failed!" })
            });;
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
            "/VirtualAccounts.json");

        setShowOverlay(true);
        setShowOverlayError({ ...showOverlayError, showError: false, message: "" })

        const withdrawTx = await withdraw(contract, props.commitment).catch((err) => {
            setShowOverlayError({ ...showOverlayError, showError: true, message: "Unable to create transactions, check the connected wallet!" })
        });
        if (withdrawTx !== undefined) {
            await withdrawTx.wait().then((receipt: any) => {
                if (receipt.status === 1) {
                    redirectToAccountPage(props.commitment);
                } else {
                    setShowOverlay(false)
                }
            }).catch((err: any) => {
                setShowOverlay(false)
            })
        }
    }

    return <><div class="w-full place-items-start text-left mt-2">
        <Overlay show={showOverlay} error={showOverlayError}></Overlay>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Add Balance</label>
        <form onSubmit={topupClicked} class="flex flex-row justofy-between flex-wrap gap-2">
            <input required class="max-w-lg px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                value={amount} onChange={(event: any) => setAmount(event.target.value)} type="number" id="amount" name="amount" placeholder="Amount" step="any" />
            <button
                aria-label={"Top up buttons"}
                class="max-w-md bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300"
                disabled={props.accountClosed}
                type="submit">Top Up</button>
        </form>
    </div>
        <div class="my-6 text-center">
            <button
                aria-label="withdraw and close account"
                disabled={props.accountClosed}
                class="bg-gray-300 mx-auto mt-2 max-w-md text-sm font-bold py-2 px-4 rounded-md transition duration-300"
                onClick={withdrawAndClose}
                type="button">Withdraw and Close</button>
        </div></>
}