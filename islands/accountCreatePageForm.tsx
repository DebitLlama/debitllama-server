import { useState } from 'preact/hooks';

import CurrencySelectDropdown from "./CurrencySelectDropdown.tsx";
import AccountPasswordInput from "./accountPasswordInput.tsx";
import { approveSpend, depositEth, depositToken, getAllowance, getContract, handleNetworkSelect, parseEther, requestAccounts, switch_setupAccount } from "../lib/frontend/web3.ts";
import { ChainIds, NetworkNames, SelectableCurrency, availableNetworks, bttMainnetCurrencies, chainIdFromNetworkName, getVirtualAccountsContractAddress } from "../lib/shared/web3.ts";
import Overlay from '../components/Overlay.tsx';
import { redirectToAccountsPage, saveAccount } from '../lib/frontend/fetch.ts';
import { AccountAccess, AccountTypes } from '../lib/enums.ts';
import TestnetTokens from './utils/TestnetTokens.tsx';
import { getGoodToKnowMessage } from "../components/components.tsx";

export const strength = [
    "Worst ☹",
    "Bad ☹",
    "Weak ☹",
    "Good ☺",
    "Strong ☻"
]


interface AccountCreatePageFormProps {
    ethEncryptPublicKey: string,
}


export default function AccountCreatePageForm(props: AccountCreatePageFormProps) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [passwordStrengthNotification, setPasswordStrengthNotification] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState("");
    const [passwordScore, setPasswordScore] = useState(0);

    const [createAccountButtonText, setCreateAccountButtonText] = useState("Create Account");
    const [selectedNetwork, setSelectedNetwork] = useState(availableNetworks[0]);
    const [selectableCurrencyArray, setSelectableCurrencyArray] = useState<SelectableCurrency[]>(bttMainnetCurrencies);

    const [selectedCurrency, setSelectedCurrency] = useState<SelectableCurrency>(selectableCurrencyArray[0]);

    const [depositAmount, setDepositAmount] = useState("");


    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlayError, setShowOverlayError] = useState({
        showError: false,
        message: "",
        action: () => setShowOverlay(false)
    })

    const [accountAccessSelected, setAccountAccessSelected] = useState<AccountAccess>(AccountAccess.metamask);

    function setPasswordAndCheck(to: string) {
        if (to === "") {
            setPasswordStrengthNotification("");
        } else {
            //@ts-ignore client-side imported library for password strength checking
            const result = zxcvbn(password);
            const score = result.score as number;
            setPasswordScore(score);
            const notification = "Strength: " + strength[score] + " " + result.feedback.warning + " " + result.feedback.suggestions;
            setPasswordStrengthNotification(notification);
        }

        setPassword(to);
        if (passwordAgain != to && passwordAgain !== "") {
            setPasswordMatchError("Password mismatch");
        } else {
            setPasswordMatchError("")
        }
    }

    function sentAndcheckPasswordMatch(setTo: string) {
        setPasswordAgain(setTo);
        if (password !== setTo) {
            setPasswordMatchError("Password mismatch");
        } else {
            setPasswordMatchError("")
        }
    }

    function isButtonDisabled(): boolean {
        if (accountAccessSelected === AccountAccess.metamask || accountAccessSelected === AccountAccess.passkey) {
            return false;
        }

        if (passwordScore < 3) {
            return true;
        }

        if (passwordAgain == "") {
            return true;
        }

        if (passwordMatchError !== "") {
            return true;
        }
        return false;
    }

    function setSelectedCurrencyHook(to: SelectableCurrency) {
        setSelectedCurrency(to);
        if (!to.native) {
            setCreateAccountButtonText(`Create Account (ERC-20)`)
        } else {
            setCreateAccountButtonText("Create Account")
        }
    }


    function handleError(msg: string) {
        console.log(msg);
    }

    async function handleTokenDeposit(
        contractAddress: string,
        virtualaccount: {
            encryptedNote: any;
            commitment: any;
        },
        erc20Contract: string,
        chainId: string,
    ) {

        const depositTx = await depositToken(
            contractAddress,
            virtualaccount.commitment,
            depositAmount,
            erc20Contract,
            virtualaccount.encryptedNote).catch(err => {
                setShowOverlayError({ ...showOverlayError, showError: true, message: "Unable to deposit token" })
            })

        if (depositTx !== undefined) {
            await depositTx.wait().then(async (receipt: any) => {
                if (receipt.status === 1) {
                    const res = await saveAccount({
                        name,
                        networkId: chainId,
                        commitment: virtualaccount.commitment,
                        currency: JSON.stringify(selectedCurrency),
                        accountType: AccountTypes.VIRTUALACCOUNT,
                        accountAccess: accountAccessSelected
                    });
                    if (res.status === 200) {
                        redirectToAccountsPage()
                    }
                    else {
                        console.log("An error occured with saving the account!");
                        const json = await res.json();
                        console.error(json)
                        setShowOverlayError({ ...showOverlayError, showError: true, message: "An error occured when saving the account!" })
                    }
                } else {
                    setShowOverlayError({ ...showOverlayError, showError: true, message: "Transaction failed" })
                }
            })
        }
    }

    async function onSubmitForm(event: any) {
        event.preventDefault();

        // I check if I can find a wallet
        const chainId = chainIdFromNetworkName[selectedNetwork as NetworkNames];

        const provider = await handleNetworkSelect(chainId, handleError);

        if (!provider) {
            return;
        }

        const address = await requestAccounts();

        const [virtualaccount, error, errorMessage] = await switch_setupAccount(
            props.ethEncryptPublicKey,
            password,
            address,
            accountAccessSelected);

        if (error) {
            handleError(errorMessage);
            return;
        }


        const contractAddress = getVirtualAccountsContractAddress[chainId as ChainIds];

        if (!selectedCurrency?.native) {
            //Approve spending, Then do the deposit

            const erc20Contract = await getContract(
                provider,
                selectedCurrency.contractAddress,
                "/ERC20.json");


            const allowance: bigint = await getAllowance(erc20Contract, address, contractAddress);
            const virtualAccountsContrat = await getContract(
                provider,
                contractAddress,
                "/VirtualAccounts.json");
            setShowOverlay(true);
            setShowOverlayError({ ...showOverlayError, showError: false, message: "" })

            if (allowance >= parseEther(depositAmount)) {
                // Just deposit

                await handleTokenDeposit(virtualAccountsContrat, virtualaccount, erc20Contract, chainId)
            } else {
                // Add allowance and then deposit 
                const approveTx = await approveSpend(
                    erc20Contract,
                    contractAddress,
                    depositAmount).catch((err) => {
                        setShowOverlayError({ ...showOverlayError, showError: true, message: "Transaction cancelled!" })
                    });

                if (approveTx !== undefined) {
                    await approveTx.wait().then(async (receipt: any) => {
                        if (receipt.status === 1) {
                            await handleTokenDeposit(virtualAccountsContrat, virtualaccount, erc20Contract, chainId)
                        }
                    }).catch((err: any) => {
                        setShowOverlayError({ ...showOverlayError, showError: true, message: "Transaction failed!" })
                    })
                }
            }
        } else {
            // Do the deposit
            const contract = await getContract(
                provider,
                contractAddress,
                "/VirtualAccounts.json");
            setShowOverlay(true);
            setShowOverlayError({ ...showOverlayError, showError: false, message: "" })

            const tx = await depositEth(
                contract,
                virtualaccount.commitment,
                depositAmount,
                virtualaccount.encryptedNote
            ).catch(err => {
                setShowOverlayError({ ...showOverlayError, showError: true, message: "Unable to deposit!" })
            });

            if (tx !== undefined) {
                await tx.wait().then(async (receipt: any) => {
                    if (receipt.status === 1) {
                        const res = await saveAccount({
                            name,
                            networkId: chainId,
                            commitment: virtualaccount.commitment,
                            currency: JSON.stringify(selectedCurrency),
                            accountType: AccountTypes.VIRTUALACCOUNT,
                            accountAccess: accountAccessSelected,
                        });
                        if (res.status === 200) {
                            redirectToAccountsPage();
                        }
                        else {
                            const json = await res.json();
                        }
                    } else {
                        setShowOverlayError({ ...showOverlayError, showError: true, message: "Transaction failed!" })
                    }
                }).catch((err: any) => {
                    setShowOverlayError({ ...showOverlayError, showError: true, message: "Transaction failed!" })
                })
            }
        }
    }


    return <form onSubmit={onSubmitForm} class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md border" method="POST">
        <Overlay show={showOverlay} error={showOverlayError}></Overlay>
        <h1 class="text-2xl font-bold text-left">New Virtual Account</h1>
        <h4 class="text-md mb-6">Virtual Accounts can hold native tokens like BTT or ERC-20 tokens. You need to deposit into the account and then you can spend from it without signing transactions with your wallet!</h4>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Account Name</label>
            <input value={name} onChange={(event: any) => setName(event.target.value)} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                type="text" id="name" name="name" placeholder="" />
        </div>
        <CurrencySelectDropdown
            setSelectedNetwork={setSelectedNetwork}
            selectedNetwork={selectedNetwork}
            selectableCurrencyArray={selectableCurrencyArray}
            setSelectableCurrencyArray={setSelectableCurrencyArray}
            availableNetworks={availableNetworks}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrencyHook}
            isWalletConnectPage={false}
        ></CurrencySelectDropdown>
        <TestnetTokens chainId={chainIdFromNetworkName[selectedNetwork as NetworkNames]}></TestnetTokens>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="amount">Deposit Amount</label>
            <input value={depositAmount} onChange={(event: any) => setDepositAmount(event.target.value)} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                type="number" id="amount" name="amount" placeholder="0" step={"any"} />
        </div>
        <AccountPasswordInput
            title='Virtual Account Password'
            password={password}
            setPassword={setPasswordAndCheck}
            passwordAgain={passwordAgain}
            setPasswordAgain={sentAndcheckPasswordMatch}
            passwordMatchError={passwordMatchError}
            passwordStrengthNotification={passwordStrengthNotification}
            accountAccessSelected={accountAccessSelected}
            setAccountAccessSelected={setAccountAccessSelected}
        ></AccountPasswordInput>
        <div class="mb-4">
            <p class="text-sm ...">{getGoodToKnowMessage(accountAccessSelected)}</p>
        </div>
        <button
            aria-label="Create new account"
            disabled={isButtonDisabled()}
            class="w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300"
            type="submit">{createAccountButtonText}</button>
    </form>
}