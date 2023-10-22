interface AccountsSelectButtonsProps {
    accountData: Array<any>,
    currentAccount: number,
    stateSetter: (to: number) => void;
}

export default function AccountsSelectButtons(props: AccountsSelectButtonsProps) {
    return <div class="flex flex-row overflow-auto pb-4 pl-4 pt-4">
        {props.accountData.map((data) => <AccountSwitcherButtons
            text={data.name}
            currentState={props.currentAccount}
            navigateTo={props.accountData.indexOf(data)}
            setStateTo={() => props.stateSetter(props.accountData.indexOf(data))}

        ></AccountSwitcherButtons>)}
    </div>

}

function AccountSwitcherButtons(props: {
    text: string;
    currentState: number;
    navigateTo: number;
    setStateTo: () => void;
}) {
    return <button aria-label={"Switch to another account"} disabled={props.currentState === props.navigateTo} onClick={props.setStateTo} class="disabled:opacity-50 disabled:cursor-not-allowed mx-2 mb-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">{props.text}</button>
}
