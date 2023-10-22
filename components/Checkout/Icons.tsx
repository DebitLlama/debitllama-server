export function NextIcon(props: { width: string }) {
    // Same width as height
    return <img alt="next icon" class="blink hideOnSmallScreen" src={"/whiteArrowRight.svg"} width={props.width} />
}
export function TopUpIcon(props: { width: string }) {
    return <img alt="topup icon" class="hideOnSmallScreen" style="margin-left: 10px;" src="/topupLogo.svg" width={props.width} />
}

export function ApprovalIcon(props: { width: string }) {
    return <img alt="approval icon" class="hideOnSmallScreen" style="margin-left: 10px;" src="/approval_delegation_white.svg" width={props.width} />
}

export function RefreshIcon(props: { width: string }) {
    return <img alt="refresh icon" class="hideOnSmallScreen" style="margin-left: 10px;" src="/refresh_white.svg" width={props.width} />
}
