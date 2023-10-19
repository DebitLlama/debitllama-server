import BuyPageLayout from "../components/BuyPageLayout.tsx"
import { CardOutline } from "../components/Cards.tsx";
import { useEffect, useState } from 'preact/hooks';
import AccountPasswordInput, { AccountPasswordInputProps } from "./accountPasswordInput.tsx";
import { strength } from "./accountCreatePageForm.tsx";
import BuyPageProfile, { ProfileProps } from "../components/BuyPageProfile.tsx";
import { approveSpend, connectWallet, connectedWalletAlready, depositEth, depositToken, formatEther, getAllowance, getContract, handleNetworkSelect, parseEther, requestAccounts, topUpETH, topUpTokens } from "../lib/frontend/web3.ts";
import { ChainIds, getAbiJsonByAccountType, getConnectedWalletsContractAddress, getVirtualAccountsContractAddress } from "../lib/shared/web3.ts";
import { requestBalanceRefresh, saveAccount, uploadProfileData } from "../lib/frontend/fetch.ts";
import { setUpAccount } from "../lib/frontend/directdebitlib.ts";
import { AccountCardElement } from "../components/AccountCardElement.tsx";
import { TooltipWithTitle, UnderlinedTd } from "../components/components.tsx";
import Overlay from "../components/Overlay.tsx";
import { AccountTypes, Pricing } from "../lib/enums.ts";
import WalletDetailsFetcher from "./WalletDetailsFetcher.tsx";

export interface Currency {
    name: string,
    native: boolean,
    contractAddress: string
}

export interface ItemProps {
    payeeAddress: string,
    currency: Currency,
    maxPrice: string,
    debitTimes: number,
    debitInterval: number,
    buttonId: string,
    redirectUrl: string,
    pricing: string,
    network: string,
    name: string,
}

export interface BuyButtonPageProps {
    isLoggedIn: boolean,
    item: ItemProps,
    url: URL,
    accounts: any,
    profileExists: boolean
    ethEncryptPublicKey: string
}


export interface RenderPurchaseDetails {
    name: string,
    network: string,
    type: string,
    pricing: string,
    maxDebitAmount: string,
    debitInterval: string,
    debitTimes: string,
}

export type ShowOverlayError = {
    showError: boolean,
    message: string,
    action: () => void
}
export interface LoggedInUiProps {
    item: ItemProps
    accounts: any;
    selectedAccount: number;
    setSelectedAccount: (to: number) => void;
    paymentAmount: string

    //# used for creating a new account

    newAccountPasswordProps: AccountPasswordInputProps,
    setNewAccountPasswordStrengthNotification: (to: string) => void;
    newAccountPasswordScore: number;
    setNewAccountPasswordScore: (to: number) => void;
    setNewAccountPasswordMatchError: (to: string) => void;
    profileExists: boolean
    profile: ProfileProps

    // used for the selected account!
    selectedAccountPassword: string
    setSelectedAccountPassword: (to: string) => void

    // used for topping up the account
    topupAmount: number,
    setTopupAmount: (to: number) => void;
    ethEncryptPublicKey: string;

    // Used for the carousel that displays the accounts!
    currentlyShowingAccount: number;
    visible: boolean;
    backClicked: () => void;
    forwardClicked: () => void;

    showOverlay: boolean;
    setShowOverlay: (to: boolean) => void;
    showOverlayError: ShowOverlayError;

    accountTypeSwitchValue: AccountTypes;
    setAccountTypeSwitchValue: (to: AccountTypes) => void;
}



export interface ButtonsBasedOnSelectionProps {
    item: ItemProps
    selected: number,
    accounts: any,
    paymentAmount: string,
    newAccountPasswordProps: AccountPasswordInputProps,
    setNewAccountPasswordStrengthNotification: (to: string) => void;
    newAccountPasswordScore: number,
    setNewAccountPasswordScore: (to: number) => void;
    setNewAccountPasswordMatchError: (to: string) => void;
    profileExists: boolean
    profile: ProfileProps
    topupAmount: number,
    setTopupAmount: (to: number) => void;
    ethEncryptPublicKey: string;
    setShowOverlay: (to: boolean) => void;
    accountTypeSwitchValue: AccountTypes;
    setAccountTypeSwitchValue: (to: AccountTypes) => void;
}

interface TopupBalanceArgs {
    topupAmount: number,
    commitment: string,
    chainId: string,
    handleError: (msg: string) => void;
    currency: Currency;
    setShowOverlay: (to: boolean) => void;
}

async function handleEthTopup(
    contract: any,
    commitment: string,
    amount: string,
    chainId: string,
    handleError: CallableFunction,
    setShowOverlay: (to: boolean) => void
) {
    setShowOverlay(true)
    const topuptx = await topUpETH(
        contract,
        commitment,
        amount
    ).catch((err) => {
        setShowOverlay(false)
    })
    if (topuptx !== undefined) {
        await topuptx.wait().then(async (receipt: any) => {
            if (receipt.status === 1) {
                const res = await requestBalanceRefresh(commitment, chainId, "buyPage");
                if (res !== 200) {
                    handleError("An error occured saving the balance!");
                    setShowOverlay(false);
                } else {
                    location.reload();
                }
            } else {
                setShowOverlay(false)
            }
        }).catch((err: any) => {
            setShowOverlay(false)
        })
    }
}

async function handleTokenTopup(
    contract: any,
    commitment: string,
    amount: string,
    chainId: string,
    handleError: CallableFunction,
    setShowOverlay: (to: boolean) => void
) {
    setShowOverlay(true)
    const topuptx = await topUpTokens(
        contract,
        commitment,
        amount
    ).catch((err: any) => {
        handleError("Unable to send transaction");
        console.error(err)
        setShowOverlay(false)
    });

    if (topuptx !== undefined) {
        await topuptx.wait().then(async (receipt: any) => {
            if (receipt.status === 1) {
                const res = await requestBalanceRefresh(commitment, chainId, "buyPage");
                if (res !== 200) {
                    handleError("An error occured saving the balance!");
                    setShowOverlay(false)
                } else {
                    location.reload();
                }
            } else {
                setShowOverlay(false)
            }
        }).catch((err: any) => {
            setShowOverlay(false)
        })
    }
}

function topupbalance(args: TopupBalanceArgs) {
    const debitContractAddress = getVirtualAccountsContractAddress[args.chainId as ChainIds];
    return async () => {

        // I need to connect the wallet do the onboarding and then do the transaction if all the conditions are met!
        const provider = await handleNetworkSelect(args.chainId, args.handleError)
        if (!provider) {
            return;
        }
        const address = await requestAccounts();

        if (args.currency.native) {
            const contract = await getContract(
                provider,
                debitContractAddress,
                "/VirtualAccounts.json");

            await handleEthTopup(
                contract,
                args.commitment,
                args.topupAmount.toString(),
                args.chainId,
                args.handleError,
                args.setShowOverlay
            )
        } else {
            const erc20Contract = await getContract(
                provider,
                args.currency.contractAddress,
                "/ERC20.json");

            const allowance: bigint = await getAllowance(erc20Contract, address, debitContractAddress);
            const contract = await getContract(
                provider,
                debitContractAddress,
                "/VirtualAccounts.json");
            if (allowance >= parseEther(args.topupAmount.toString())) {
                // Just do the top up
                await handleTokenTopup(
                    contract,
                    args.commitment,
                    args.topupAmount.toString(),
                    args.chainId,
                    args.handleError,
                    args.setShowOverlay
                );
            } else {
                // Add allowance and then deposit
                const approveTx = await approveSpend(
                    erc20Contract,
                    debitContractAddress,
                    args.topupAmount.toString()
                )

                if (approveTx !== undefined) {
                    await approveTx.wait().then(async (receipt: any) => {
                        if (receipt.status === 1) {
                            await handleTokenTopup(
                                contract,
                                args.commitment,
                                args.topupAmount.toString(),
                                args.chainId,
                                args.handleError,
                                args.setShowOverlay
                            );
                        }
                    })
                }
            }
        }
    }
}

function approveBalance(args: TopupBalanceArgs) {
    const debitContractAddress = getConnectedWalletsContractAddress[args.chainId as ChainIds];

    return async () => {
        // I need to connect the wallet do the onboarding and then do the transaction if all the conditions are met!
        const provider = await handleNetworkSelect(args.chainId, args.handleError)
        if (!provider) {
            return;
        }
        const erc20Contract = await getContract(
            provider,
            args.currency.contractAddress,
            "/ERC20.json");

        args.setShowOverlay(true);
        // Add allowance and then deposit
        const approveTx = await approveSpend(
            erc20Contract,
            debitContractAddress,
            args.topupAmount.toString()
        ).catch((err: any) => {
            args.setShowOverlay(false);
        })

        if (approveTx !== undefined) {
            await approveTx.wait().then(async (receipt: any) => {
                if (receipt.status === 1) {
                    const res = await requestBalanceRefresh(args.commitment, args.chainId, "buyPage");
                    if (res !== 200) {
                        handleError("An error occured saving the balance!");
                        args.setShowOverlay(false);
                    } else {
                        location.reload();
                    }
                }
            })
        }

    }
}

function refreshBalanceClick(args: TopupBalanceArgs) {
    return async () => {
        const res = await requestBalanceRefresh(args.commitment, args.chainId, "buyPage");
        if (res !== 200) {
            handleError("An error occured saving the balance!");
        } else {
            location.reload();
        }
    }
}

interface onCreateAccountSubmitArgs {
    chainId: string,
    handleError: CallableFunction,
    profileExists: boolean,
    profile: ProfileProps,
    selectedCurrency: Currency,
    depositAmount: string,
    passwordProps: AccountPasswordInputProps,
    ethEncryptPublicKey: string,
    accountCurrency: string,
    setShowOverlay: (to: boolean) => void;
    accountTypeSwitchValue: AccountTypes
}

async function handleTokenTX(
    debitcontract: any,
    virtualaccount: {
        encryptedNote: any;
        commitment: any;
    },
    erc20Contract: string,
    chainId: string,
    depositAmount: string,
    accountName: string,
    selectedCurrency: Currency,
    setShowOverlay: (to: boolean) => void,
    selectedAccountType: AccountTypes

) { // The TX is either a deposit or a connected wallet!
    const tx = selectedAccountType === AccountTypes.VIRTUALACCOUNT
        ? await depositToken(
            debitcontract,
            virtualaccount.commitment,
            depositAmount,
            erc20Contract,
            virtualaccount.encryptedNote).catch((err) => {
                setShowOverlay(false)
            })
        : await connectWallet(
            debitcontract,
            virtualaccount.commitment,
            erc20Contract,
            virtualaccount.encryptedNote).catch((err) => {
                setShowOverlay(false)
            })

    if (tx !== undefined) {
        await tx.wait().then(async (receipt: any) => {
            if (receipt.status === 1) {
                const resp = await saveAccount({
                    name: accountName,
                    networkId: chainId,
                    commitment: virtualaccount.commitment,
                    currency: JSON.stringify(selectedCurrency),
                    accountType: selectedAccountType
                })
                if (resp.status === 500) {
                    setShowOverlay(false);
                } else {
                    location.reload();
                }
            } else {
                setShowOverlay(false)
            }
        }).catch((err: any) => {
            setShowOverlay(false)
        })
    }
}


function onCreateAccountSubmit(args: onCreateAccountSubmitArgs) {
    return async (e: any) => {
        e.preventDefault();

        const accountName = e.target.accountName.value;

        const provider = await handleNetworkSelect(args.chainId, args.handleError);

        if (!provider) {
            return;
        }
        const address = await requestAccounts();

        if (!args.profileExists) {
            const uploadProfileStatus = await uploadProfileData({
                firstname: args.profile.firstname,
                lastname: args.profile.lastname,
                addressline1: args.profile.addressLine1,
                addressline2: args.profile.addressLine2,
                city: args.profile.city,
                postcode: args.profile.postcode,
                country: args.profile.country
            });

            if (uploadProfileStatus !== 200) {
                handleError("Unable to upload profile");
                return;
            }
        }
        const virtualaccount = await setUpAccount(args.passwordProps.password, args.ethEncryptPublicKey);

        const debitContractAddress = args.accountTypeSwitchValue === AccountTypes.VIRTUALACCOUNT
            ? getVirtualAccountsContractAddress[args.chainId as ChainIds]
            : getConnectedWalletsContractAddress[args.chainId as ChainIds];


        if (args.accountTypeSwitchValue === AccountTypes.CONNECTEDWALLET) {
            // I just connect the wallet and the approval needs to happen on the top up page where I will navigate to after.
            const contract = await getContract(provider, debitContractAddress, "/ConnectedWallets.json");

            //Check if the connected wallet already exists, and if yes, show an error!
            const connectedAlready = await connectedWalletAlready(contract, address, args.selectedCurrency.contractAddress);

            if (connectedAlready) {
                handleError("You already have a wallet connected to that token!");
                return;
            }
        }


        const debitContract = await getContract(
            provider,
            debitContractAddress,
            getAbiJsonByAccountType[args.accountTypeSwitchValue]);

        if (!args.selectedCurrency?.native) {
            //Approve spending, Then do the deposit

            const erc20Contract = await getContract(
                provider,
                args.selectedCurrency.contractAddress,
                "/ERC20.json");


            const allowance: bigint = await getAllowance(erc20Contract, address, debitContractAddress);
            args.setShowOverlay(true)

            if (allowance >= parseEther(args.depositAmount)) {
                // Just deposit
                await handleTokenTX(
                    debitContract,
                    virtualaccount,
                    erc20Contract,
                    args.chainId,
                    args.depositAmount,
                    accountName,
                    args.selectedCurrency,
                    args.setShowOverlay,
                    args.accountTypeSwitchValue
                ).catch((err: any) => {
                    args.setShowOverlay(false);
                })
            } else {
                // Add allowance and then deposit 
                const approveTx = await approveSpend(
                    erc20Contract,
                    debitContractAddress,
                    args.depositAmount).catch((err: any) => {
                        args.setShowOverlay(false);
                    });

                if (approveTx !== undefined) {
                    await approveTx.wait().then(async (receipt: any) => {
                        if (receipt.status === 1) {
                            await handleTokenTX(
                                debitContract,
                                virtualaccount,
                                erc20Contract,
                                args.chainId,
                                args.depositAmount,
                                accountName,
                                args.selectedCurrency,
                                args.setShowOverlay,
                                args.accountTypeSwitchValue
                            ).catch((err: any) => {
                                args.setShowOverlay(false);
                            })
                        }
                    }).catch((err: any) => {
                        args.setShowOverlay(false);
                    })
                }
            }
        } else {
            args.setShowOverlay(true)
            const tx = await depositEth(
                debitContract,
                virtualaccount.commitment,
                args.depositAmount,
                virtualaccount.encryptedNote
            ).catch((err) => {
                args.setShowOverlay(false)
            });

            if (tx !== undefined) {
                await tx.wait().then(async (receipt: any) => {
                    if (receipt.status === 1) {

                        const resp = await saveAccount(
                            {
                                name: accountName,
                                networkId: args.chainId,
                                commitment: virtualaccount.commitment,
                                currency: args.accountCurrency,
                                accountType: AccountTypes.VIRTUALACCOUNT
                            })
                        if (resp.status === 500) {

                            args.setShowOverlay(false);
                        } else {
                            location.reload();
                        }

                    } else {
                        args.setShowOverlay(false);
                    }
                }).catch((err: any) => {
                    args.setShowOverlay(false);
                })
            }
        }
    }
}

function handleError(msg: string) {
    // error function to display a snackbar is side effecty, vanilla magic
    const errorDisplay = document.getElementById("error-display") as HTMLDivElement;
    const errorText = document.getElementById("error-text") as HTMLParagraphElement;
    errorText.textContent = msg;

    if (errorDisplay.classList.contains("hide")) {
        errorDisplay.classList.remove("hide");
    }
    if (errorDisplay.classList.contains("fade-out-element")) {
        errorDisplay.classList.remove("fade-out-element")
    }
    errorDisplay.classList.add("fade-in-element");
    errorDisplay.classList.add("show");
    setTimeout(() => {
        // Time out biach!
        errorDisplay.classList.add("fade-out-element");
        errorDisplay.classList.remove("show");
        errorDisplay.classList.remove("fade-in-element");
        errorDisplay.classList.add("hide");
    }, 5000);
}

function NextIcon(props: { width: string }) {
    // Same width as height
    return <img class="blink hideOnSmallScreen" src={"/whiteArrowRight.svg"} width={props.width} />
}

function TopUpIcon(props: { width: string }) {
    return <img class="hideOnSmallScreen" style="margin-left: 10px;" src="/topupLogo.svg" width={props.width} />
}

function ApprovalIcon(props: { width: string }) {
    return <img class="hideOnSmallScreen" style="margin-left: 10px;" src="/approval_delegation_white.svg" width={props.width} />
}

function RefreshIcon(props: { width: string }) {
    return <img class="hideOnSmallScreen" style="margin-left: 10px;" src="/refresh_white.svg" width={props.width} />
}


function CreateNewAccountUI(props: {
    item: ItemProps,
    profileExists: boolean,
    profile: ProfileProps
    newAccountPasswordProps: AccountPasswordInputProps,
    paymentAmount: string,
    ethEncryptPublicKey: string;
    setShowOverlay: (to: boolean) => void;
    setPasswordAndCheck: (to: string) => void;
    isButtonDisabled: () => boolean;
    sentAndcheckPasswordMatch: (setTo: string) => void;
    accountTypeSwitchValue: AccountTypes;
    setAccountTypeSwitchValue: (to: AccountTypes) => void;

}) {
    const isERC20 = !props.item.currency.native;

    return <form class="p-2" onSubmit={onCreateAccountSubmit({
        chainId: props.item.network,
        handleError,
        profileExists: props.profileExists,
        profile: props.profile,
        passwordProps: props.newAccountPasswordProps,
        selectedCurrency: props.item.currency,
        depositAmount: props.paymentAmount,
        ethEncryptPublicKey: props.ethEncryptPublicKey,
        accountCurrency: props.item.currency.name,
        setShowOverlay: props.setShowOverlay,
        accountTypeSwitchValue: props.accountTypeSwitchValue
    })}>
        <BuyPageProfile
            profileExists={props.profileExists}
            profile={props.profile}></BuyPageProfile>
        <div class="py-[0.25rem]">
            <hr
                class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            {isERC20 ?
                <div class="flex flex-row justify-center mb-4">

                    <label class="toggle select-none bg-gray-200 hover:bg-gray-100 border p-4 text-center w-full">
                        <span class={`toggle-label text-sm ${props.accountTypeSwitchValue === AccountTypes.VIRTUALACCOUNT ? "text-indigo-800" : "text-neutral"}`}>
                            Virtual Account
                        </span>
                        <input checked={props.accountTypeSwitchValue === AccountTypes.CONNECTEDWALLET} onChange={(event: any) => {
                            if (event.target.checked) {
                                props.setAccountTypeSwitchValue(AccountTypes.CONNECTEDWALLET)
                            } else {
                                props.setAccountTypeSwitchValue(AccountTypes.VIRTUALACCOUNT)
                            }
                        }} class="toggle-checkbox" type="checkbox" />
                        <div class="toggle-switch"></div>
                        <span class={`toggle-label text-sm ${props.accountTypeSwitchValue === AccountTypes.CONNECTEDWALLET ? "text-indigo-800" : "text-neutral"}`}>
                            Connect Wallet
                        </span>
                    </label>
                </div> : null}

            {isERC20 ? <TooltipWithTitle
                title="Which account to choose?"
                extraStyle="right: -70%"
                message="Virtual accounts hold deposits and need to be topped up while connected wallets let you make payments using tokens you hold in a cold wallet."></TooltipWithTitle>
                :
                <TooltipWithTitle
                    title="Virtual Account?"
                    extraStyle="right: -70%"
                    message="Virtual accounts are smart contract accounts that hold deposits. The value must be deposited into them. They can be created per subsciption if you want!"></TooltipWithTitle>}

            <hr
                class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="accountName">Account Name</label>
                <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    type="text" id="accountName" name="accountName" placeholder="" />
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="amount">{props.accountTypeSwitchValue === AccountTypes.VIRTUALACCOUNT ? "Deposit " : "Approve spending "} {props.item.currency.name}</label>
                <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    value={props.paymentAmount} type="number" id="amount" name="amount" placeholder="0" step="any" />
            </div>
            <AccountPasswordInput
                title={"Account Password"}
                password={props.newAccountPasswordProps.password}
                setPassword={props.setPasswordAndCheck}
                passwordAgain={props.newAccountPasswordProps.passwordAgain}
                setPasswordAgain={props.sentAndcheckPasswordMatch}
                passwordMatchError={props.newAccountPasswordProps.passwordMatchError}
                passwordStrengthNotification={props.newAccountPasswordProps.passwordStrengthNotification}
            ></AccountPasswordInput>
            <div class="text-center">
                <button
                    disabled={props.isButtonDisabled()}
                    type="submit"
                    class="mb-4 mt-2 bg-indigo-500 text-white text-xl font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300"
                >{props.accountTypeSwitchValue === AccountTypes.VIRTUALACCOUNT ? "Create Account" : "Connect Wallet"}</button>
            </div>
        </div>
    </form>
}

function RefreshBalanceUI(props: {
    paymentAmount: string,
    selectedAccount: any,
    topupAmount: number,
    setTopupAmount: (to: number) => void,
    item: ItemProps,
    setShowOverlay: (to: boolean) => void
}) {
    const amountToTopUpWEI = parseEther(props.paymentAmount) - parseEther(props.selectedAccount.balance);
    const amountToTopUpFormatted = parseFloat(formatEther(amountToTopUpWEI));
    const inputValue = props.topupAmount < amountToTopUpFormatted ? amountToTopUpFormatted : props.topupAmount;
    return <div class="flex flex-col p-3 rounded-xl">
        <div class="flex flex-row justify-left text-lg text-gray-900 p-3">
            <h2><strong>Insufficient balance!</strong> <br /> Update it or select another account!</h2>
        </div>
        <WalletDetailsFetcher
            // This is only rendered when a connected wallet is selected!
            accountType={AccountTypes.CONNECTEDWALLET}
            creatorAddress={props.selectedAccount.creator_address}
            networkId={props.item.network as ChainIds}
            tokenAddress={props.item.currency.contractAddress}
            currencyName={props.item.currency.name}
        ></WalletDetailsFetcher>
        <table class="table-fixed w-full">
            <thead>
                <tr>
                    <th class="w-2/6"></th>
                    <th class="w-2/6"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <UnderlinedTd extraStyles="rounded-lg bg-gray-50 dark:bg-black-800 text-black-400 dark:text-black-200 text-lg font-bold" >Update Allowance</UnderlinedTd>
                    <UnderlinedTd extraStyles="importantNoPaddingLeft rounded-lg bg-gray-50 dark:bg-black-800 text-black-400 dark:text-black-200 text-sm font-bold" >
                        <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                            value={inputValue} onChange={(event: any) => props.setTopupAmount(parseFloat(event.target.value))} type="number" id="amount" name="amount" placeholder="Amount" />
                        <button
                            onClick={approveBalance({
                                topupAmount: inputValue,
                                commitment: props.selectedAccount.commitment,
                                chainId: props.item.network,
                                handleError,
                                currency: props.item.currency,
                                setShowOverlay: props.setShowOverlay
                            })}
                            class="w-full flex flex-row justify-center text-xl font-bold mb-4 mt-4 text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 rounded-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                            <div class="flex flex-col justify-center">
                                <p class="pt-1">Approve</p>
                            </div>
                            <div class="flex flex-col justify-center">
                                <ApprovalIcon width="30" />
                            </div>
                        </button>
                    </UnderlinedTd>
                </tr>
                <tr>
                    <UnderlinedTd extraStyles="rounded-lg bg-gray-50 dark:bg-black-800 text-black-400 dark:text-black-200 text-lg font-bold" >Refresh Balance</UnderlinedTd>
                    <UnderlinedTd extraStyles="importantNoPaddingLeft rounded-lg bg-gray-50 dark:bg-black-800 text-black-400 dark:text-black-200 text-sm font-bold" >
                        <p>You just added balance to the connected wallet, but can't see it?</p>
                        <button
                            onClick={refreshBalanceClick({
                                topupAmount: inputValue,
                                commitment: props.selectedAccount.commitment,
                                chainId: props.item.network,
                                handleError,
                                currency: props.item.currency,
                                setShowOverlay: props.setShowOverlay
                            })}
                            class="w-full flex flex-row justify-center text-xl font-bold mb-4 mt-4 text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 rounded-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                            <div class="flex flex-col justify-center">
                                <p>Refresh</p>
                            </div>
                            <div class="flex flex-col justify-center">
                                <RefreshIcon width="30" />
                            </div>
                        </button>
                    </UnderlinedTd>
                </tr>
            </tbody>
        </table>
    </div>
}

function TopUpUI(props: {
    paymentAmount: string,
    selectedAccount: any,
    topupAmount: number,
    setTopupAmount: (to: number) => void,
    item: ItemProps,
    setShowOverlay: (to: boolean) => void
}) {
    const amountToTopUpWEI = parseEther(props.paymentAmount) - parseEther(props.selectedAccount.balance);
    const amountToTopUpFormatted = parseFloat(formatEther(amountToTopUpWEI));
    const inputValue = props.topupAmount < amountToTopUpFormatted ? amountToTopUpFormatted : props.topupAmount;
    return <div class="flex flex-col p-3 rounded-xl">
        <div class="flex flex-row justify-left text-lg text-gray-900 p-3">
            <h2><strong>Insufficient balance!</strong> <br /> Update it or select another account!</h2>
        </div>
        <table class="table-fixed w-full">
            <thead>
                <tr>
                    <th class="w-2/6"></th>
                    <th class="w-2/6"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <UnderlinedTd extraStyles="rounded-lg bg-gray-50 dark:bg-black-800 text-black-400 dark:text-black-200 text-lg font-bold" >Top Up Balance</UnderlinedTd>
                    <UnderlinedTd extraStyles="importantNoPaddingLeft rounded-lg bg-gray-50 dark:bg-black-800 text-black-400 dark:text-black-200 text-sm font-bold" >
                        <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                            value={inputValue} onChange={(event: any) => props.setTopupAmount(parseFloat(event.target.value))} type="number" id="amount" name="amount" placeholder="Amount" />
                        <button
                            onClick={topupbalance({
                                topupAmount: inputValue,
                                commitment: props.selectedAccount.commitment,
                                chainId: props.item.network,
                                handleError,
                                currency: props.item.currency,
                                setShowOverlay: props.setShowOverlay
                            })}
                            class=" w-full flex flex-row justify-center text-xl font-bold mb-4 mt-4 text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 rounded-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                            <div class="flex flex-col justify-center">
                                <p>Add</p>
                            </div>
                            <div class="flex flex-col justify-center">
                                <TopUpIcon width="30" />
                            </div>
                        </button>
                    </UnderlinedTd>
                </tr>
            </tbody>
        </table>
    </div>
}

function NextBttnUi(props: {
    buttonId: string,
    commitment: string,
}) {
    return <div class="flex p-3 rounded-xl">
        <form
            class={"mx-auto"}
            action={"app/approvepayment"}
            method={"POST"}
        >
            <input type="hidden" value={props.buttonId} name="debititem" />
            <input type="hidden" value={props.commitment} name="accountcommitment" />
            <button
                type={"submit"}
                class="w-full flex flex-row justify-center text-xl font-bold mb-4 mt-4 text-white bg-indigo-700 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 rounded-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 indigobg">
                <div class="flex flex-col justify-center">
                    <p>Finish Checkout</p>
                </div>
                <div class="flex flex-col justify-center">
                    <NextIcon width={"30px"} />
                </div>
            </button>
        </form>
    </div>
}

function UIBasedOnSelection(props: ButtonsBasedOnSelectionProps) {

    if (props.selected === 0 || props.selected < 0) {
        return <div class="mx-auto mt-4 mb-10 bt-4">
        </div>
    }

    function setPasswordAndCheck(to: string) {
        if (to === "") {
            props.setNewAccountPasswordStrengthNotification("");
        } else {
            //@ts-ignore client-side imported library for password strength checking
            const result = zxcvbn(props.newAccountPasswordProps.password);
            const score = result.score as number;
            props.setNewAccountPasswordScore(score);
            const notification = "Strength: " + strength[score] + " " + result.feedback.warning + " " + result.feedback.suggestions;
            props.setNewAccountPasswordStrengthNotification(notification);
        }
        props.newAccountPasswordProps.setPassword(to);
        if (props.newAccountPasswordProps.passwordAgain != to && props.newAccountPasswordProps.passwordAgain !== "") {
            props.setNewAccountPasswordMatchError("Password mismatch");
        } else {
            props.setNewAccountPasswordMatchError("")
        }
    }

    function sentAndcheckPasswordMatch(setTo: string) {
        props.newAccountPasswordProps.setPasswordAgain(setTo);
        if (props.newAccountPasswordProps.password !== setTo) {
            props.setNewAccountPasswordMatchError("Password mismatch");
        } else {
            props.setNewAccountPasswordMatchError("")
        }
    }
    function isButtonDisabled(): boolean {
        if (props.newAccountPasswordScore < 3) {
            return true;
        }

        if (props.newAccountPasswordProps.passwordAgain == "") {
            return true;
        }

        if (props.newAccountPasswordProps.passwordMatchError !== "") {
            return true;
        }
        return false;
    }
    const accIndex = props.selected - 2;

    const selectedAccount = props.accounts[accIndex];
    if (props.selected === 1) {
        return <CreateNewAccountUI
            {...props}
            isButtonDisabled={isButtonDisabled}
            sentAndcheckPasswordMatch={sentAndcheckPasswordMatch}
            setPasswordAndCheck={setPasswordAndCheck}
            accountTypeSwitchValue={props.accountTypeSwitchValue}
            setAccountTypeSwitchValue={props.setAccountTypeSwitchValue}
        ></CreateNewAccountUI>
    }

    if (props.selected > 1) {

        if (props.item.pricing !== Pricing.Dynamic &&
            parseFloat(selectedAccount.balance) < parseFloat(props.paymentAmount)) {

            if (selectedAccount.accountType === AccountTypes.VIRTUALACCOUNT) {
                //If it's a virtual account with fixed pricing and the balance is lower than what I need to pay, I prompt top up.
                return <TopUpUI
                    paymentAmount={props.paymentAmount}
                    selectedAccount={selectedAccount}
                    topupAmount={props.topupAmount}
                    setTopupAmount={props.setTopupAmount}
                    item={props.item}
                    setShowOverlay={props.setShowOverlay}

                ></TopUpUI>
            } else {
                // Display missing balance show a refresh button and an approval button
                return <RefreshBalanceUI
                    paymentAmount={props.paymentAmount}
                    selectedAccount={selectedAccount}
                    topupAmount={props.topupAmount}
                    setTopupAmount={props.setTopupAmount}
                    item={props.item}
                    setShowOverlay={props.setShowOverlay}
                ></RefreshBalanceUI>
            }
        }
        // Show the next button and allow the user to subscribe!
        return <NextBttnUi
            buttonId={props.item.buttonId}
            commitment={selectedAccount.commitment}
        ></NextBttnUi>
    }

    return <div></div>

}


function LoggedInUi(props: LoggedInUiProps) {
    // I need to display the accounts as cards, they must be selectable so I need state here and a button to approve payment after typing the account password
    const acc = props.accounts[props.currentlyShowingAccount];
    return <div class="flex flex-col">
        <Overlay show={props.showOverlay} error={props.showOverlayError}></Overlay>
        <div class="flex flex-col flex-wrap"></div>
        <div class="flex flex-col justify-center">
            <div class="flex flex-row justify-left flex-wrap" >
                <CardOutline
                    setSelected={props.setSelectedAccount}
                    id={1}
                    selected={props.selectedAccount} extraCss="ml-4 md:ml-0 mb-4 bg-gradient-to-b w-max h-14 text-indigo-500 font-semibold from-slate-50 to-indigo-100 px-10 py-3 rounded-2xl shadow-indigo-400 shadow-md border-b-4 hover border-b border-indigo-200 hover:shadow-sm transition-all duration-500">
                    New Account
                </CardOutline>
            </div>

            <div class="flex flex-row overflow-auto pb-4 pl-4 md:pl-1 pr-4 pt-4">
                {props.accounts.map((data: any) => <CardOutline
                    extraCss={`mt-1 mr-4 ${props.visible ? "fade-in-element-checkout" : "fade-out-elements-checkout"}`}
                    setSelected={props.setSelectedAccount}
                    id={props.accounts.indexOf(data) + 2}
                    selected={props.selectedAccount}
                >
                    <AccountCardElement
                        network={""}
                        balance={data.balance}
                        currency={data.currency}
                        name={data.name}
                        accountType={data.accountType}
                        closed={data.closed}
                    ></AccountCardElement>
                </CardOutline>)}
            </div>

            <UIBasedOnSelection
                newAccountPasswordScore={props.newAccountPasswordScore}
                item={props.item}
                selected={props.selectedAccount}
                accounts={props.accounts}
                paymentAmount={props.paymentAmount}
                newAccountPasswordProps={props.newAccountPasswordProps}
                setNewAccountPasswordStrengthNotification={props.setNewAccountPasswordStrengthNotification}
                setNewAccountPasswordScore={props.setNewAccountPasswordScore}
                setNewAccountPasswordMatchError={props.setNewAccountPasswordMatchError}
                profileExists={props.profileExists}
                profile={props.profile}
                topupAmount={props.topupAmount}
                setTopupAmount={props.setTopupAmount}
                ethEncryptPublicKey={props.ethEncryptPublicKey}
                setShowOverlay={props.setShowOverlay}
                accountTypeSwitchValue={props.accountTypeSwitchValue}
                setAccountTypeSwitchValue={props.setAccountTypeSwitchValue}
            ></UIBasedOnSelection>

        </div>
    </div >
}


export interface LoggedOutUiProps {
    url: URL,
    buttonid: string
}
function LoggedOutUi(props: LoggedOutUiProps) {
    const err = new URL(props.url).searchParams.get("error");
    return <div class="pb-3 max-w-sm mx-auto">
        {err && (
            <div class="bg-red-400 border-l-4 p-4" role="alert">
                <p class="font-bold">Error</p>
                <p>{err}</p>
            </div>
        )}
        <form class="space-y-4 md:space-y-6" method="POST">
            <input type="hidden" name="buttonId" value={props.buttonid} />
            <div class="">
                <h2 class="text-2xl font-bold mb-5 text-center text-gray-400 select-none">Log In To Continue</h2>
            </div>
            <div>
                <label for="email" class="block mb-2 text-sm font-medium">Your email</label>
                <input type="email" name="email" id="email" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="name@company.com" />
            </div>
            <div>
                <label for="password" class="block mb-2 text-sm font-medium">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" />
            </div>

            <button type="submit" class="w-full text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Log In</button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account yet? <a target="_blank" href="/signup" class="font-medium text-indigo-600 hover:underline dark:text-indigo-500">Sign up</a>
            </p>
        </form>
    </div>
}

export default function BuyButtonPage(props: BuyButtonPageProps) {
    const [selectedAccount, setSelectedAccount] = useState(0);

    //New account creation state
    const [newAccountPassword, setNewAccountPassword] = useState("");
    const [newAccountPasswordAgain, setNewAccountPasswordAgain] = useState("");
    const [newAccountPasswordStrengthNotification, setNewAccountPasswordStrengthNotification] = useState("");
    const [newAccountPasswordMatchError, setNewAccountPasswordMatchError] = useState("");
    const [newAccountPasswordScore, setNewAccountPasswordScore] = useState(0);

    // Selected account password to pay 
    const [selectedAccountPassword, setSelectedAccountPassword] = useState("")

    //Top up account state
    const [topupAmount, setTopupAmount] = useState(0);


    // profile state
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [postcode, setPostcode] = useState("");
    const [country, setCountry] = useState("");

    const [currentlyShowingAccount, setCurrentlyShowingAccount] = useState(0);
    const [accountVisible, setAccountVisible] = useState(true);

    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlayError, setShowOverlayError] = useState({
        showError: false,
        message: "",
        action: () => setShowOverlay(false)
    })

    const [accountTypeSwitchValue, setAccountTypeSwitchValue] = useState<AccountTypes>(AccountTypes.VIRTUALACCOUNT);

    useEffect(() => {
        setSelectedAccount(props.accounts.length !== 0 ? 2 : 1);
    }, [])

    function backClicked() {
        if (currentlyShowingAccount === 0) {
            if (props.accounts.length - 1 < 0) {
                return;
            }
            setAccountVisible(false);
            setTimeout(() => {
                setCurrentlyShowingAccount(props.accounts.length - 1);
                // Selected account is +2 to the currently selected account always!
                setSelectedAccount(props.accounts.length + 1);
                setAccountVisible(true);

            }, 400)

        } else {
            setAccountVisible(false);
            setTimeout(() => {
                setCurrentlyShowingAccount(currentlyShowingAccount - 1);
                setSelectedAccount(currentlyShowingAccount + 1)
                setAccountVisible(true);
            }, 400)
        }

    }
    function forwardClicked() {
        if (props.accounts.length - 1 === currentlyShowingAccount) {
            setAccountVisible(false);
            setTimeout(() => {
                setCurrentlyShowingAccount(0);
                setSelectedAccount(2);
                setAccountVisible(true)
            }, 400)

        } else {
            setAccountVisible(false)
            setTimeout(() => {
                setCurrentlyShowingAccount(currentlyShowingAccount + 1)
                setSelectedAccount(currentlyShowingAccount + 3);
                setAccountVisible(true)
            }, 400)
        }
    }


    return <BuyPageLayout
        isLoggedIn={props.isLoggedIn}
        item={props.item}>
        {props.isLoggedIn ? <LoggedInUi
            item={props.item}
            paymentAmount={props.item.maxPrice}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
            accounts={props.accounts}
            newAccountPasswordProps={
                {
                    title: "Account Password",
                    password: newAccountPassword,
                    setPassword: setNewAccountPassword,
                    passwordAgain: newAccountPasswordAgain,
                    setPasswordAgain: setNewAccountPasswordAgain,
                    passwordStrengthNotification: newAccountPasswordStrengthNotification,
                    passwordMatchError: newAccountPasswordMatchError
                }
            }
            setNewAccountPasswordStrengthNotification={setNewAccountPasswordStrengthNotification}
            setNewAccountPasswordScore={setNewAccountPasswordScore}
            setNewAccountPasswordMatchError={setNewAccountPasswordMatchError}
            newAccountPasswordScore={newAccountPasswordScore}

            selectedAccountPassword={selectedAccountPassword}
            setSelectedAccountPassword={setSelectedAccountPassword}
            profileExists={props.profileExists}
            profile={{
                firstname,
                lastname,
                addressLine1,
                addressLine2,
                city,
                postcode,
                country,
                setFirstName,
                setLastName,
                setAddressLine1,
                setAddressLine2,
                setCity,
                setPostcode,
                setCountry
            }}
            topupAmount={topupAmount}
            setTopupAmount={setTopupAmount}
            ethEncryptPublicKey={props.ethEncryptPublicKey}
            currentlyShowingAccount={currentlyShowingAccount}
            visible={accountVisible}
            backClicked={backClicked}
            forwardClicked={forwardClicked}
            showOverlay={showOverlay}
            setShowOverlay={setShowOverlay}
            showOverlayError={showOverlayError}
            accountTypeSwitchValue={accountTypeSwitchValue}
            setAccountTypeSwitchValue={setAccountTypeSwitchValue}
        ></LoggedInUi> : <LoggedOutUi buttonid={props.item.buttonId} url={props.url} ></LoggedOutUi>}
    </BuyPageLayout>

}


