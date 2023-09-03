import BuyPageLayout from "../components/BuyPageLayout.tsx"
import { CardOutline } from "../components/Cards.tsx";
import { useState } from 'preact/hooks';
import AccountPasswordInput, { AccountPasswordInputProps } from "./accountPasswordInput.tsx";
import { strength } from "./accountCreatePageForm.tsx";
import BuyPageProfile, { ProfileProps } from "../components/BuyPageProfile.tsx";
import { approveSpend, depositEth, depositToken, getAllowance, getContract, getJsonRpcProvider, handleNetworkSelect, parseEther, requestAccounts, topUpETH, topUpTokens } from "../lib/frontend/web3.ts";
import { ChainIds, getDirectDebitContractAddress } from "../lib/shared/web3.ts";
import { requestBalanceRefresh, saveAccountData, uploadProfileData } from "../lib/frontend/fetch.ts";
import { setUpAccount } from "../lib/frontend/directdebitlib.ts";
import { AccountCardElement, CheckoutAccountCardElement } from "../components/AccountCardElement.tsx";

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
    ethEncryptPublicKey: string
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
    ethEncryptPublicKey: string

}

interface TopupBalanceArgs {
    topupAmount: number,
    commitment: string,
    chainId: string,
    handleError: (msg: string) => void;
    currency: Currency;
}

async function handleEthTopup(
    contract: any,
    commitment: string,
    amount: string,
    chainId: string,
    handleError: CallableFunction) {

    const topuptx = await topUpETH(
        contract,
        commitment,
        amount
    )
    if (topuptx !== undefined) {
        await topuptx.wait().then(async (receipt: any) => {
            if (receipt.status === 1) {
                const res = await requestBalanceRefresh(commitment, chainId);
                if (res !== 200) {
                    handleError("An error occured saving the balance!");
                } else {
                    location.reload();
                }
            }
        })
    }
}

async function handleTokenTopup(
    contract: any,
    commitment: string,
    amount: string,
    chainId: string,
    handleError: CallableFunction
) {
    const topuptx = await topUpTokens(
        contract,
        commitment,
        amount
    );

    if (topuptx !== undefined) {
        await topuptx.wait().then(async (receipt: any) => {
            if (receipt.status === 1) {
                const res = await requestBalanceRefresh(commitment, chainId);
                if (res !== 200) {
                    handleError("An error occured saving the balance!");
                } else {
                    location.reload();
                }
            }
        })
    }
}


function topupbalance(args: TopupBalanceArgs) {
    const debitContractAddress = getDirectDebitContractAddress[args.chainId as ChainIds];
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
                "/DirectDebit.json");

            await handleEthTopup(
                contract,
                args.commitment,
                args.topupAmount.toString(),
                args.chainId,
                args.handleError
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
                "/DirectDebit.json");

            if (allowance >= parseEther(args.topupAmount.toString())) {
                // Just do the top up
                await handleTokenTopup(
                    contract,
                    args.commitment,
                    args.topupAmount.toString(),
                    args.chainId,
                    args.handleError
                );
            } else {
                // Add allowance and then deposit
                const approveTx = await approveSpend(
                    args.currency.contractAddress,
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
                                args.handleError);
                        }
                    })
                }
            }

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
    accountCurrency: string
}

async function handleTokenDeposit(
    debitcontract: any,
    virtualaccount: {
        encryptedNote: any;
        commitment: any;
    },
    erc20Contract: string,
    chainId: string,
    depositAmount: string,
    accountName: string,
    accountCurrency: string
) {
    const depositTx = await depositToken(
        debitcontract,
        virtualaccount.commitment,
        depositAmount,
        erc20Contract,
        virtualaccount.encryptedNote)

    if (depositTx !== undefined) {
        await depositTx.wait().then(async (receipt: any) => {
            if (receipt.status === 1) {
                const saveStatus = await saveAccountData(chainId, virtualaccount.commitment, accountName, accountCurrency)
                if (saveStatus === 500) {
                    //TODO: Should display an error
                } else {
                    location.reload();
                }
            }
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
                walletaddress: address,
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
        const debitContractAddress = getDirectDebitContractAddress[args.chainId as ChainIds];
        const debitContract = await getContract(
            provider,
            debitContractAddress,
            "/DirectDebit.json");
        if (!args.selectedCurrency?.native) {
            //Approve spending, Then do the deposit

            const erc20Contract = await getContract(
                provider,
                args.selectedCurrency.contractAddress,
                "/ERC20.json");


            const allowance: bigint = await getAllowance(erc20Contract, address, debitContractAddress);

            // TODO: Need to disable the button and maybe show a popup so people don't navigate away!

            if (allowance >= parseEther(args.depositAmount)) {
                // Just deposit
                await handleTokenDeposit(
                    debitContract,
                    virtualaccount,
                    erc20Contract,
                    args.chainId,
                    args.depositAmount,
                    accountName,
                    args.accountCurrency)
            } else {
                // Add allowance and then deposit 
                const approveTx = await approveSpend(
                    erc20Contract,
                    debitContractAddress,
                    args.depositAmount);

                if (approveTx !== undefined) {
                    await approveTx.wait().then(async (receipt: any) => {
                        if (receipt.status === 1) {
                            //TODO: Test tokens 
                            await handleTokenDeposit(
                                debitContract,
                                virtualaccount,
                                erc20Contract,
                                args.chainId,
                                args.depositAmount,
                                accountName,
                                args.accountCurrency)
                        }
                    })
                }
            }
        } else {

            const tx = await depositEth(
                debitContract,
                virtualaccount.commitment,
                args.depositAmount,
                virtualaccount.encryptedNote
            );

            if (tx !== undefined) {
                await tx.wait().then(async (receipt: any) => {
                    if (receipt.status === 1) {

                        const saveStatus = await saveAccountData(
                            args.chainId,
                            virtualaccount.commitment,
                            accountName,
                            args.accountCurrency)
                        if (saveStatus === 500) {
                            //TODO: Should display an error
                        } else {
                            location.reload();
                        }

                    }
                })
            }
        }
    }
}

//TODO: Do the handle error properly! Display an error in the DOM! maybe a snackbar?

function handleError(msg: string) {
    console.error(msg)
}


function UIBasedOnSelection(props: ButtonsBasedOnSelectionProps) {

    if (props.selected === 0 || props.selected < 0) {
        return <div class="mx-auto mt-4 mb-10 bt-4">
            <p class="text-xl text-slate-600">Select an account</p>
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


    if (props.selected === 1) {
        return <form class="mx-auto p-2" onSubmit={onCreateAccountSubmit({
            chainId: props.item.network,
            handleError,
            profileExists: props.profileExists,
            profile: props.profile,
            passwordProps: props.newAccountPasswordProps,
            selectedCurrency: props.item.currency,
            depositAmount: props.paymentAmount,
            ethEncryptPublicKey: props.ethEncryptPublicKey,
            accountCurrency: props.item.currency.name
        })}>
            <BuyPageProfile
                profileExists={props.profileExists}
                profile={props.profile}></BuyPageProfile>
            <div class="bg-white  px-3 py-[0.25rem]">
                <h4 class="text-xl text-center mb-2">Create New Account</h4>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="accountName">Account Name</label>
                    <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        type="text" id="accountName" name="accountName" placeholder="" />
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="amount">Deposit Amount in ({props.item.currency.name})</label>
                    {!props.item.currency.native ? <span class="text-sm text-gray-300">{props.item.currency.contractAddress}</span> : null}
                    <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        value={props.paymentAmount} type="number" id="amount" name="amount" placeholder="0" />
                </div>
                <AccountPasswordInput
                    password={props.newAccountPasswordProps.password}
                    setPassword={setPasswordAndCheck}
                    passwordAgain={props.newAccountPasswordProps.passwordAgain}
                    setPasswordAgain={sentAndcheckPasswordMatch}
                    passwordMatchError={props.newAccountPasswordProps.passwordMatchError}
                    passwordStrengthNotification={props.newAccountPasswordProps.passwordStrengthNotification}
                ></AccountPasswordInput>
                <div class="text-center">
                    <button
                        disabled={isButtonDisabled()}
                        type="submit"
                        class="mb-4 mt-2 bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300"
                    >Create account</button>
                </div>
            </div>
        </form>
    }

    if (props.selected > 1) {
        const accIndex = props.selected - 2;
        const selectedAccount = props.accounts[accIndex];

        if (parseFloat(selectedAccount.balance) < parseFloat(props.paymentAmount)) {
            const amountToTopUp = parseFloat(props.paymentAmount) - parseFloat(selectedAccount.balance);
            const inputValue = props.topupAmount < amountToTopUp ? amountToTopUp : props.topupAmount;
            return <>
                <div class="mx-auto mt-4 bt-4">
                    <p class="text-xl text-slate-600">Top Up Balance</p>
                    <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        value={inputValue} onChange={(event: any) => props.setTopupAmount(parseFloat(event.target.value))} type="number" id="amount" name="amount" placeholder="Amount" />
                    <button
                        onClick={topupbalance({
                            topupAmount: inputValue,
                            commitment: selectedAccount.commitment,
                            chainId: props.item.network,
                            handleError,
                            currency: props.item.currency
                        })}
                        class="mb-4 mt-2 w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300"
                        type="submit">Top Up</button>
                </div></>
        }

        return <>
            <form
                class={"mx-auto"}
                action={"app/approvepayment"}
                method={"POST"}
            >
                <input type="hidden" value={props.item.buttonId} name="debititem" />
                <input type="hidden" value={selectedAccount.commitment} name="accountcommitment" />
                <button
                    type={"submit"}
                    class="w-60 mb-4 mt-4 mx-auto text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Next</button>
            </form>
        </>
    }

    return <div></div>

}

function LoggedInUi(props: LoggedInUiProps) {
    // I need to display the accounts as cards, they must be selectable so I need state here and a button to approve payment after typing the account password

    return <div class="flex flex-col">
        <div class="flex flex-col flex-wrap"></div>
        <div class="flex flex-col justify-center">
            <div class="flex flex-row justify-center mb-8" >
                <CardOutline setSelected={props.setSelectedAccount} id={1} selected={props.selectedAccount} extraCss="margin_0_auto mb-8 bg-gradient-to-b w-max mx-auto text-indigo-500 font-semibold from-slate-50 to-indigo-100 px-10 py-3 rounded-2xl shadow-indigo-400 shadow-md border-b-4 hover border-b border-indigo-200 hover:shadow-sm transition-all duration-500">
                    New Account
                </CardOutline>
            </div>
            <div class="flex flex-row flex-wrap ml-4 justify-center">
                {props.accounts.map(
                    (acc: any) =>
                        <CardOutline
                            extraCss=""
                            setSelected={props.setSelectedAccount}
                            id={props.accounts.indexOf(acc) + 2}
                            selected={props.selectedAccount}
                        >
                            <AccountCardElement
                                network={""}
                                balance={acc.balance}
                                currency={acc.currency}
                                name={acc.name}
                            ></AccountCardElement>
                        </CardOutline>
                )}
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

            ></UIBasedOnSelection>

        </div>
    </div>
}


export interface LoggedOutUiProps {
    url: URL,
    buttonid: string
}
function LoggedOutUi(props: LoggedOutUiProps) {
    const err = props.url.searchParams.get("error");

    return <div class="p-3 max-w-sm	mx-auto">
        {err && (
            <div class="bg-red-400 border-l-4 p-4" role="alert">
                <p class="font-bold">Error</p>
                <p>{err}</p>
            </div>
        )}
        <form class="space-y-4 md:space-y-6" method="POST">
            <input type="hidden" name="buttonId" value={props.buttonid} />
            <div class="mx-auto">
                <h2 class="text-2xl font-bold mb-5 text-center">Login</h2>
            </div>
            <div>
                <label for="email" class="block mb-2 text-sm font-medium">Your email</label>
                <input type="email" name="email" id="email" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="name@company.com" />
            </div>
            <div>
                <label for="password" class="block mb-2 text-sm font-medium">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" />
            </div>

            <button type="submit" class="w-full text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Login In</button>
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

        ></LoggedInUi> : <LoggedOutUi buttonid={props.item.buttonId} url={props.url} ></LoggedOutUi>}
    </BuyPageLayout>

}


