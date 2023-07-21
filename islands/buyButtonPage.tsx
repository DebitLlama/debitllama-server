import BuyPageLayout from "../components/BuyPageLayout.tsx"
import { CardOutline } from "../components/Cards.tsx";
import { useState } from 'preact/hooks';
import AccountPasswordInput, { AccountPasswordInputProps } from "./accountPasswordInput.tsx";
import { strength } from "./accountCreatePageForm.tsx";
import BuyPageProfile, { ProfileProps } from "../components/BuyPageProfile.tsx";

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
    debitType: string
}

export interface BuyButtonPageProps {
    isLoggedIn: boolean,
    item: ItemProps,
    url: URL,
    accounts: any,
    profileExists: boolean
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
    accounts: any;
    selectedAccount: number;
    setSelectedAccount: (to: number) => void;
    paymentAmount: string

    //# used for creating a new account

    newAccountPasswordProps: AccountPasswordInputProps,
    setNewAccountPasswordStrengthNotification: (to: string) => void;
    setNewAccountPasswordScore: (to: number) => void;
    setNewAccountPasswordMatchError: (to: string) => void;
    profileExists: boolean
    profile: ProfileProps

    // used for the selected account!
    selectedAccountPassword: string
    setSelectedAccountPassword: (to: string) => void
}



export interface ButtonsBasedOnSelectionProps {
    selected: number,
    accounts: any,
    paymentAmount: string,
    newAccountPasswordProps: AccountPasswordInputProps,
    setNewAccountPasswordStrengthNotification: (to: string) => void;
    setNewAccountPasswordScore: (to: number) => void;
    setNewAccountPasswordMatchError: (to: string) => void;
    profileExists: boolean
    profile: ProfileProps
}

async function onCreateAccountSubmit() {

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

    if (props.selected === 1) {
        return <form class="mx-auto p-2" onSubmit={onCreateAccountSubmit}>
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
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="amount">Deposit Amount</label>
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
                        type="submit"
                        class="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                    >Create account</button>
                </div>
            </div>


        </form>
    }

    if (props.selected > 1) {
        const accIndex = props.selected - 2;
        const selectedAccount = props.accounts[accIndex];

        if (parseFloat(selectedAccount.balance) < parseFloat(props.paymentAmount)) {
            return <>
                <div class="mx-auto mt-4 bt-4">
                    <p class="text-xl text-slate-600">Not Enough Account Balance</p>
                </div></>
        }

        return <>
            <div class="w-60 mx-auto mt-4">
                <label for="password" class="block mb-2 text-sm font-medium">Account Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" />
            </div>
            <button class="w-60 mb-4 mt-4 mx-auto text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Pay</button>
        </>
    }

    return <div></div>


}

function LoggedInUi(props: LoggedInUiProps) {
    // I need to display the accounts as cards, they must be selectable so I need state here and a button to approve payment after typing the account password

    return <div class="flex flex-col">
        <div class="flex flex-col flex-wrap"></div>
        <div class="flex flex-col justify-center">
            <div class="flex flex-row ml-4">
                {props.accounts.map(
                    (acc: any) =>
                        <CardOutline
                            setSelected={props.setSelectedAccount}
                            id={props.accounts.indexOf(acc) + 2}
                            selected={props.selectedAccount}
                        >
                            <div class="flex flex-col text-center mt-2">
                                <p class="font-sans subpixel-antialiased font-light	text-slate-500">{acc.name}</p>
                                <div class="flex flex-row justify-center mt-4 font-bold">
                                    {acc.balance} {" "} {acc.currency}
                                </div>
                            </div>
                        </CardOutline>
                )}

                <CardOutline setSelected={props.setSelectedAccount} id={1} selected={props.selectedAccount}>
                    <div class="flex flex-col text-center mt-2">
                        <p class="font-sans subpixel-antialiased font-light	text-slate-500">New Account</p>
                        <div class="flex flex-row justify-center">
                            <img class={"mt-4"} src="/add.svg" width="60px" />
                        </div>
                    </div>
                </CardOutline>

            </div>
            <UIBasedOnSelection
                selected={props.selectedAccount}
                accounts={props.accounts}
                paymentAmount={props.paymentAmount}
                newAccountPasswordProps={props.newAccountPasswordProps}
                setNewAccountPasswordStrengthNotification={props.setNewAccountPasswordStrengthNotification}
                setNewAccountPasswordScore={props.setNewAccountPasswordScore}
                setNewAccountPasswordMatchError={props.setNewAccountPasswordMatchError}
                profileExists={props.profileExists}
                profile={props.profile}

            ></UIBasedOnSelection>
            {/* {UIBasedOnSelection(props.selectedAccount, props.accounts, props.paymentAmount)} */}


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

    const [selectedAccountPassword, setSelectedAccountPassword] = useState("")

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

        ></LoggedInUi> : <LoggedOutUi buttonid={props.item.buttonId} url={props.url} ></LoggedOutUi>}
    </BuyPageLayout>

}


