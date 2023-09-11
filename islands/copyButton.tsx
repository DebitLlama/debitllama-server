export interface CopyButtonProps {
    str: string;
    iconColor: "black" | "white"
}

export default function CopyButton(props: CopyButtonProps) {

    return <button onClick={copyStringToClipboard(props.str)}><img width="20px" src={props.iconColor === "black" ? "/copyIcon.svg" : "/copyIcon_white.svg"} /></button>
}
function copyStringToClipboard(str: string) {
    return async () => await navigator.clipboard.writeText(str);
}
