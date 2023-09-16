import { useState } from 'preact/hooks';
import Overlay from "../components/Overlay.tsx";
import { ChainIds, SelectableCurrency, availableNetworks, bittorrentCurrencies, chainIdFromNetworkName, getConnectedWalletsContractAddress } from "../lib/shared/web3.ts";
import CurrencySelectDropdown from "./CurrencySelectDropdown.tsx";
import AccountPasswordInput from "./accountPasswordInput.tsx";
import { connectWallet, getContract, handleNetworkSelect, requestAccounts } from '../lib/frontend/web3.ts';
import { setUpAccount } from '../lib/frontend/directdebitlib.ts';
import { redirectToAccountPage, saveAccount } from '../lib/frontend/fetch.ts';
import { AccountTypes } from "../lib/enums.ts";

export const strength = [
    "Worst ☹",
    "Bad ☹",
    "Weak ☹",
    "Good ☺",
    "Strong ☻"
]

interface ConnectWalletPageFormProps {
    ethEncryptPublicKey: string,
    walletaddress: string
}

export default function ConnectWalletPageForm(props: ConnectWalletPageFormProps) {
    const [showOverlay, setShowOverlay] = useState(false);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [passwordStrengthNotification, setPasswordStrengthNotification] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState("");
    const [passwordScore, setPasswordScore] = useState(0);

    const [connectWalletButtonText, setConnectWalletButtonText] = useState("Connect Wallet");
    const [selectedNetwork, setSelectedNetwork] = useState(availableNetworks[0]);
    const [selectableCurrencyArray, setSelectableCurrencyArray] = useState<SelectableCurrency[]>(bittorrentCurrencies.filter((curr) => curr.native === false));
    const [selectedCurrency, setSelectedCurrency] = useState<SelectableCurrency>(selectableCurrencyArray[0]);

    const [walletMismatchError, setShowWalletMismatchError] = useState(false);
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

    function handleError(msg: string) {
        console.log(msg);
    }

    function setSelectedCurrencyHook(to: SelectableCurrency) {
        setSelectedCurrency(to);
    }

    const onSubmitForm = async (event: any) => {
        event?.preventDefault();
        setShowWalletMismatchError(false);

        // Check if I can find a wallet
        //@ts-ignore ignoring because in other file it's not erroring. bastard
        const chainId = chainIdFromNetworkName[selectedNetwork as NetworkNames];

        const provider = await handleNetworkSelect(chainId, handleError);

        if (!provider) {
            return;
        }
        const address = await requestAccounts();


        // It's a virtual account variable but will be used with connected wallet!
        const virtualaccount = await setUpAccount(password, props.ethEncryptPublicKey);

        const contractAddress = getConnectedWalletsContractAddress[chainId as ChainIds];

        // I just connect the wallet and the approval needs to happen on the top up page where I will navigate to after.
        const contract = await getContract(provider, contractAddress, "/ConnectedWallets.json");
        setShowOverlay(true);
        const tx = await connectWallet(
            contract,
            virtualaccount.commitment,
            selectedCurrency.contractAddress,
            virtualaccount.encryptedNote).catch(err => {
                console.log("connect wallet err", err)
                setShowOverlay(false);
            });

        if (tx !== undefined) {
            await tx.wait().then((async (receipt: any) => {
                if (receipt.status === 1) {
                    const res = await saveAccount({
                        name,
                        networkId: chainId,
                        commitment: virtualaccount.commitment,
                        currency: JSON.stringify(selectedCurrency),
                        accountType: AccountTypes.CONNECTEDWALLET
                    })
                    if (res.status === 200) {
                        redirectToAccountPage(virtualaccount.commitment);
                    } else {
                        console.log("Error occured saving the account!")
                        console.error(await res.json())
                    }
                } else {
                    setShowOverlay(false);
                }
            })).catch((err: any) => {
                setShowOverlay(false);
            })
        }
    }

    return <form onSubmit={onSubmitForm} class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md" method="POST">
        <Overlay show={showOverlay} ></Overlay>
        <h1 class="text-2xl font-bold text-left">Connect Wallet</h1>
        <h4 class="text-md mb-6">A connected wallet will allow you to spend tokens directly from it, instead of depositing into a smart contract like virtual accounts. </h4>
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
        <AccountPasswordInput
            password={password}
            setPassword={setPasswordAndCheck}
            passwordAgain={passwordAgain}
            setPasswordAgain={sentAndcheckPasswordMatch}
            passwordMatchError={passwordMatchError}
            passwordStrengthNotification={passwordStrengthNotification}
        ></AccountPasswordInput>
        <div class="mb-4">
            <p class="text-sm ...">The password is used for encrypting your account and it's needed for spending. Do not reuse your login password. The accounts are non-custodial and if you loose your password we can't recover it for you. You can always disconnect your wallet if you don't want to continue using it!</p>
        </div>
        {walletMismatchError ? <p class="text-sm text-red-500">Your browser wallet does not match your profile!</p> : ""}
        <button
            disabled={isButtonDisabled()}
            class="w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300"
            type="submit">{connectWalletButtonText}</button>
    </form>
}