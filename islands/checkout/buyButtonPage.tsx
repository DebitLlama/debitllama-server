import BuyPageLayout from "../../components/BuyPageLayout.tsx"
import { useEffect, useState } from 'preact/hooks';
import { AccountAccess, AccountTypes } from "../../lib/enums.ts";
import { LoggedOutUi } from "../../components/Checkout/LoggedOutUi.tsx";
import { BuyButtonPageProps } from "../../lib/types/checkoutTypes.ts";
import { LoggedInUi } from "../../components/Checkout/LoggedInUi.tsx";


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
    const [accountAccessSelected, setAccountAccessSelected] = useState<AccountAccess>(AccountAccess.metamask);



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
                    passwordMatchError: newAccountPasswordMatchError,
                    accountAccessSelected: accountAccessSelected,
                    setAccountAccessSelected: setAccountAccessSelected
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
            requires2Fa={props.requires2Fa}
            url={props.url}
        ></LoggedInUi> : <LoggedOutUi buttonid={props.item.buttonId} url={props.url} ></LoggedOutUi>}
    </BuyPageLayout>

}


