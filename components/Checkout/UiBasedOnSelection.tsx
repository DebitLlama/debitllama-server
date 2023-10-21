import { strength } from "../../islands/accountCreatePageForm.tsx";
import { AccountTypes, Pricing } from "../../lib/enums.ts";
import { ButtonsBasedOnSelectionProps } from "../../lib/types/checkoutTypes.ts";
import { CreateNewAccountUI } from "./CreateNewAccountUI.tsx";
import { NextBttnUi } from "../../islands/checkout/NextBttnUi.tsx";
import { RefreshBalanceUI } from "./RefreshBalanceUI.tsx";
import { TopUpUI } from "./TopUpUI.tsx";

export function UIBasedOnSelection(props: ButtonsBasedOnSelectionProps) {

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
            requires2FA={props.requires2Fa}
        ></NextBttnUi>
    }

    return <div></div>

}

