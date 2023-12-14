import { ChainIds, networkNameFromId } from "../../lib/shared/web3.ts";
import { LoggedInUiProps } from "../../lib/types/checkoutTypes.ts";
import { AccountCardElement } from "../AccountCardElement.tsx";
import { CardOutline } from "../Cards.tsx";
import Overlay from "../Overlay.tsx";
import { UIBasedOnSelection } from "./UiBasedOnSelection.tsx";


export function LoggedInUi(props: LoggedInUiProps) {
    const err = new URL(props.url).searchParams.get("error");

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
                        commitment={data.commitment}
                        calledFrom={"buyPage"}
                        network={data.network_id}
                        networkName={networkNameFromId[data.network_id as ChainIds]}
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
                requires2Fa={props.requires2Fa}
            ></UIBasedOnSelection>
            {err && (
                <div class="bg-red-400 border-l-4 p-4" role="alert">
                    <p class="font-bold">Error</p>
                    <p>{err}</p>
                </div>
            )}
        </div>
    </div >
}


