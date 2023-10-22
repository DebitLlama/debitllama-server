import { ChainIds, networkNameFromId } from "../lib/shared/web3.ts";

interface DebitItemTableRowProps {
    name: string,
    network: string,
    maxDebitAmount: string,
    currency: string,
    debitInterval: string,
    debitTimes: string,
    pricing: string,
    button_id: string,
    payment_intents_count: number
    deleted: boolean,
    created_at: string,
    index: number
}
export default function DebitItemTableRow(props: DebitItemTableRowProps) {
    const network = networkNameFromId[props.network as ChainIds];
    function onRowClicked(url: string) {
        return () => {
            window.open(location.origin + url, "_self")
        }
    }
    return <tr tabIndex={props.index} class="cursor-pointer bg-white hover:bg-gray-300" onClick={onRowClicked(`/app/item?q=${props.button_id}`)}>
        <td class="px-4 py-4 text-sm whitespace-nowrap">
            <div class="flex items-center gap-x-6">
                {GetRowIcon(props.deleted)}
            </div>
        </td>
        <td class="px-4 py-4 text-sm   whitespace-nowrap">{props.payment_intents_count}</td>
        <td class="px-4 py-4 text-sm font-medium  whitespace-nowrap">
            <div class="flex items-center gap-x-2">
                <div>
                    <p class="text-xs font-normal  ">{props.name}</p>
                </div>
            </div>
        </td>
        <td class="px-4 py-4 text-sm font-medium  whitespace-nowrap">
            <div class="flex items-center gap-x-2">
                <div>
                    <p class="text-xs font-normal  ">{network}</p>
                </div>
            </div>
        </td>
        <td class="px-4 py-4 text-sm font-medium  whitespace-nowrap">
            <div class="flex items-center gap-x-2">
                <div>
                    <p class="text-xs font-normal  ">{props.pricing}</p>
                </div>
            </div>
        </td>
        <td class="px-4 py-4 text-sm   whitespace-nowrap">
            <div class="flex items-center gap-x-2">
                <div>
                    <p class="text-xs font-normal  ">{props.maxDebitAmount} {props.currency}</p>
                </div>
            </div>
        </td>
        <td class="px-4 py-4 text-sm   whitespace-nowrap">{props.debitInterval}</td>
        <td class="px-4 py-4 text-sm   whitespace-nowrap">{props.debitTimes}</td>
        <td class="px-4 py-4 text-sm   whitespace-nowrap">{new Date(props.created_at).toLocaleString()}</td>
    </tr>
}

function GetRowIcon(isDeleted: boolean) {
    if (isDeleted) {
        return <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-320h80v-166l64 62 56-56-160-160-160 160 56 56 64-62v166ZM280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" /></svg>
    } else {
        return <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M570-104q-23 23-57 23t-57-23L104-456q-11-11-17.5-26T80-514v-286q0-33 23.5-56.5T160-880h286q17 0 32 6.5t26 17.5l352 353q23 23 23 56.5T856-390L570-104Zm-57-56 286-286-353-354H160v286l353 354ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640ZM160-800Z" /></svg>
    }
}
