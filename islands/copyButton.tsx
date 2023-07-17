export interface CopyButtonProps {
    str: string
}

export default function CopyButton(props: CopyButtonProps) {

    return <button onClick={copyStringToClipboard(props.str)}><img width="20px" src="/copyIcon.svg" /></button>
}
function copyStringToClipboard(str: string) {
    return async () => await navigator.clipboard.writeText(str);
}
