import { useState } from 'preact/hooks';

import CurrencySelectDropdown from "./CurrencySelectDropdown.tsx";
import AccountPasswordInput from "./accountPasswordInput.tsx";
import { approveSpend, depositEth, depositToken, getAllowance, getContract, handleNetworkSelect, parseEther, requestAccounts } from "../lib/frontend/web3.ts";
import { setUpAccount } from '../lib/frontend/directdebitlib.ts';
import { ChainIds, NetworkNames, SelectableCurrency, availableNetworks, bittorrentCurrencies, chainIdFromNetworkName, getVirtualAccountsContractAddress } from "../lib/shared/web3.ts";
import Overlay from '../components/Overlay.tsx';
import { redirectToAccountsPage, saveAccount } from '../lib/frontend/fetch.ts';
import { AccountTypes } from '../lib/enums.ts';

export const strength = [
    "Worst ☹",
    "Bad ☹",
    "Weak ☹",
    "Good ☺",
    "Strong ☻"
]


interface AccountCreatePageFormProps {
    ethEncryptPublicKey: string,
    walletaddress: string
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
    const [selectableCurrencyArray, setSelectableCurrencyArray] = useState<SelectableCurrency[]>(bittorrentCurrencies);

    const [selectedCurrency, setSelectedCurrency] = useState<SelectableCurrency>(selectableCurrencyArray[0]);

    const [depositAmount, setDepositAmount] = useState("");

    const [walletMismatchError, setShowWalletMismatchError] = useState(false);

    const [showOverlay, setShowOverlay] = useState(false);

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
        chainId: string
    ) {

        const depositTx = await depositToken(
            contractAddress,
            virtualaccount.commitment,
            depositAmount,
            erc20Contract,
            virtualaccount.encryptedNote).catch(err => {
                setShowOverlay(false);
            })

        if (depositTx !== undefined) {
            await depositTx.wait().then(async (receipt: any) => {
                if (receipt.status === 1) {
                    const res = await saveAccount({
                        name,
                        networkId: chainId,
                        commitment: virtualaccount.commitment,
                        currency: JSON.stringify(selectedCurrency),
                        accountType: AccountTypes.VIRTUALACCOUNT
                    });
                    if (res.status === 200) {
                        redirectToAccountsPage()
                    }
                    else {
                        console.log("An error occured with saving the account!");
                        const json = await res.json();
                        console.error(json)
                    }
                } else {
                    setShowOverlay(false);
                }
            })
        }
    }

    async function onSubmitForm(event: any) {
        event.preventDefault();
        setShowWalletMismatchError(false);

        // I check if I can find a wallet
        const chainId = chainIdFromNetworkName[selectedNetwork as NetworkNames];

        const provider = await handleNetworkSelect(chainId, handleError);

        if (!provider) {
            return;
        }

        const address = await requestAccounts();

        // if (props.walletaddress !== address) {
        //     setShowWalletMismatchError(true);
        //     return
        // }

        const virtualaccount = await setUpAccount(password, props.ethEncryptPublicKey);

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
            if (allowance >= parseEther(depositAmount)) {
                // Just deposit

                await handleTokenDeposit(virtualAccountsContrat, virtualaccount, erc20Contract, chainId)
            } else {
                // Add allowance and then deposit 
                const approveTx = await approveSpend(
                    erc20Contract,
                    contractAddress,
                    depositAmount).catch((err) => {
                        setShowOverlay(false)
                    });

                if (approveTx !== undefined) {
                    await approveTx.wait().then(async (receipt: any) => {
                        if (receipt.status === 1) {
                            await handleTokenDeposit(virtualAccountsContrat, virtualaccount, erc20Contract, chainId)
                        }
                    }).catch((err: any) => {
                        setShowOverlay(false)
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
            const tx = await depositEth(
                contract,
                virtualaccount.commitment,
                depositAmount,
                virtualaccount.encryptedNote
            ).catch(err => {
                setShowOverlay(false);
            });

            if (tx !== undefined) {
                await tx.wait().then(async (receipt: any) => {
                    if (receipt.status === 1) {
                        const res = await saveAccount({
                            name,
                            networkId: chainId,
                            commitment: virtualaccount.commitment,
                            currency: JSON.stringify(selectedCurrency),
                            accountType: AccountTypes.VIRTUALACCOUNT
                        });
                        if (res.status === 200) {
                            redirectToAccountsPage();
                        }
                        else {
                            const json = await res.json();
                        }
                    } else {
                        setShowOverlay(false);
                    }
                }).catch((err: any) => {
                    setShowOverlay(false)
                })
            }
        }
    }


    return <form onSubmit={onSubmitForm} class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md" method="POST">
        <Overlay show={showOverlay} ></Overlay>
        <h1 class="text-2xl font-bold text-left">New Virtual Account</h1>
        <h4 class="text-md mb-6">Virtual Accounts can hold native tokens like BTT or ERC-20 tokens. You need to deposit into the account and then you can spend it without using your wallet again!</h4>
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
        ></CurrencySelectDropdown>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="amount">Deposit Amount</label>
            <input value={depositAmount} onChange={(event: any) => setDepositAmount(event.target.value)} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                type="number" id="amount" name="amount" placeholder="0" step={"any"} />
        </div>
        <AccountPasswordInput
            password={password}
            setPassword={setPasswordAndCheck}
            passwordAgain={passwordAgain}
            setPasswordAgain={sentAndcheckPasswordMatch}
            passwordMatchError={passwordMatchError}
            passwordStrengthNotification={passwordStrengthNotification}
        ></AccountPasswordInput>
        <div class="mb-4">
            <p class="text-sm ...">The password is used for encrypting your account and it's needed for spending. Do not reuse your login password. The accounts are non-custodial and if you loose your password we can't recover it for you. You can always close the account and withdraw the deposit with the wallet you created it with.</p>

        </div>
        {walletMismatchError ? <p class="text-sm text-red-500">Your browser wallet does not match your profile!</p> : ""}
        <button
            disabled={isButtonDisabled()}
            class="w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300"
            type="submit">{createAccountButtonText}</button>
    </form>
}