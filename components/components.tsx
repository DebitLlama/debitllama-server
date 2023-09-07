import { ComponentChildren } from "preact";

export interface UnderlinedTdProps {
    children: ComponentChildren
    extraStyles: string
}

export function UnderlinedTd(props: UnderlinedTdProps) {
    return <td class={`${props.extraStyles} border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400`}>{props.children}</td>
}


export interface TooltipProps {
    message: string
}

export function Tooltip(props: TooltipProps) {
    return <div class="tooltip">
        ?
        <span aria-label="Tooltip helptext" class="tooltiptext">{props.message}</span>
    </div>
}

export function getSubscriptionTooltipMessage(pricing: string) {
    if (pricing === "Fixed") {
        return "Fixed priced subscriptions will always debit the approved amount."
    } else {
        return "Metered subscriptions have dynamic pricing where the approved amount represents a maximum";
    }
}

export function getDebitIntervalText(debitInterval: number, debitTimes: number) {
    if (debitTimes === 1) {
        return "Unspecified";
    }
    if (debitInterval === 0) {
        return "Unspecified"
    }

    if (debitInterval === 1) {
        return "The payment can be withdrawn every day"
    }

    return `The payment can be withdrawn only every ${debitInterval} days`

}


export function formatTxHash(tx: string) {
    return `${tx.substring(0, 5)}...${tx.substring(tx.length - 5, tx.length)}`
}

export function RenderIdentifier(id: string) {
    // /?TODO: Copy icon and copy the text
    return <span>{`${id.substring(0, 5)}...${id.substring(id.length - 5, id.length)}`}</span>
}
