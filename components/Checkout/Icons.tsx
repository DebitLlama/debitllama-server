export function NextIcon(props: { width: string }) {
    // Same width as height
    return <img class="blink hideOnSmallScreen" src={"/whiteArrowRight.svg"} width={props.width} />
}
export function TopUpIcon(props: { width: string }) {
    return <img class="hideOnSmallScreen" style="margin-left: 10px;" src="/topupLogo.svg" width={props.width} />
}

export function ApprovalIcon(props: { width: string }) {
    return <img class="hideOnSmallScreen" style="margin-left: 10px;" src="/approval_delegation_white.svg" width={props.width} />
}

export function RefreshIcon(props: { width: string }) {
    return <img class="hideOnSmallScreen" style="margin-left: 10px;" src="/refresh_white.svg" width={props.width} />
}
