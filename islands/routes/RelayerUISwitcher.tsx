import { useState } from "preact/hooks";
import RelayerDetailsCard from "../RelayerDetailsCard.tsx";
import RelayerTopupHistory from "../pagination/RelayerTopupHistory.tsx";
import RelayedTxHistory from "../pagination/RelayedTxHistoryWithPagination.tsx";

export interface RelayerUISwitcherProps {
    data: any
}

enum RelayerUIState {
    TOPUPBTTN, TOPUPHISTORY, TXHISTORY
}

function UiSwitcherButtons(props: {
    text: string;
    currentState: RelayerUIState;
    navigateTo: RelayerUIState;
    setStateTo: () => void;
}) {
    return <button aria-label="Switch tab button" disabled={props.currentState === props.navigateTo} onClick={props.setStateTo} class="disabled:opacity-50 disabled:cursor-not-allowed mx-2 mb-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">{props.text}</button>
}

export default function RelayerUISwitcher(props: RelayerUISwitcherProps) {
    const [uiSwitcher, setUiSwitcher] = useState(RelayerUIState.TOPUPBTTN);

    const setUIStateTo = (to: RelayerUIState) => () => setUiSwitcher(to);

    function getSelectedUI() {
        switch (uiSwitcher) {
            case RelayerUIState.TOPUPBTTN:
                return <div class="flex items-center justify-center h-full">
                    <div class="bg-white shadow-2xl p-6 rounded-2xl border-2 border-gray-50 w-96">
                        <div class="flex flex-col">
                            <div class={"flex flex-row justify-start"}>
                                <img src="/blockchain.png" width="40px" alt="relayer logo" />
                                <p class={"text-xl font-extrabold leading-10 pl-6"}>Relayer</p>
                            </div>
                            <RelayerDetailsCard
                                relayerData={props.data.relayerBalanceData[0]}></RelayerDetailsCard>
                        </div>
                    </div>
                </div>
            case RelayerUIState.TOPUPHISTORY:
                return <RelayerTopupHistory totalPages={props.data.totalPagesForTopupHistory} topUpHistoryData={props.data.relayerTopUpHistoryData}></RelayerTopupHistory>
            case RelayerUIState.TXHISTORY:
                return <RelayedTxHistory paymentIntent_id={undefined} searchBy="user_id" totalPages={props.data.totalPagesForRelayerTxHistory} txHistory={props.data.relayerTxHistoryData}></RelayedTxHistory>
            default:
                return null;
        }
    }


    return <div class="container mx-auto py-8">
        <div class={"flex flex-row justify-center"}>
            <UiSwitcherButtons navigateTo={RelayerUIState.TOPUPBTTN} setStateTo={setUIStateTo(RelayerUIState.TOPUPBTTN)} currentState={uiSwitcher} text="Balance"></UiSwitcherButtons>
            <UiSwitcherButtons navigateTo={RelayerUIState.TOPUPHISTORY} setStateTo={setUIStateTo(RelayerUIState.TOPUPHISTORY)} currentState={uiSwitcher} text="Top up History"></UiSwitcherButtons>
            <UiSwitcherButtons navigateTo={RelayerUIState.TXHISTORY} setStateTo={setUIStateTo(RelayerUIState.TXHISTORY)} currentState={uiSwitcher} text="Transaction History"></UiSwitcherButtons>
        </div>
        {getSelectedUI()}
    </div>
}