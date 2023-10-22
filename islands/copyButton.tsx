import { useState } from "preact/hooks";

export interface CopyButtonProps {
    str: string;
    iconColor: "black" | "white"
}

export default function CopyButton(props: CopyButtonProps) {
    const [showAnimate, setShowAnimate] = useState(false);


    return <button class={`border shadow-lg rounded p-5 ${showAnimate ? "animate-bounce" : ""}`} onClick={copyStringToClipboard(props.str, setShowAnimate)}><img alt="copy button" width="40px" src={props.iconColor === "black" ? "/copyIcon.svg" : "/copyIcon_white.svg"} /></button>
}
function copyStringToClipboard(str: string, setShowAnimate: CallableFunction) {
    return async () => await navigator.clipboard.writeText(str).then(() => {
        setShowAnimate(true);
        setTimeout(() => {
            setShowAnimate(false);
        }, 1500)
    });
}
