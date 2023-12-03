import { useState } from "preact/hooks";
import { HideLogo, ShowLogo } from "../../components/components.tsx";


export interface ShowContentProps {
    content: string;
}

function replaceStringWithAsterisk(content: string) {
    const last8 = content.slice(content.length - 8, content.length);
    let buff = "";
    for (let i = 0; i < content.length - 8; i++) {
        buff += "*";
    }
    return buff + last8;
}

export default function ShowAndHideContent(props: ShowContentProps) {
    const [show, setShow] = useState(false);
    return <div class="flex flex-row justify-between">
        <pre>
            {show ? props.content : replaceStringWithAsterisk(props.content)}
        </pre>
        <button aria-label={"Show the API Key"} class="bg-gray-200 rounded-full shadow-lg"
            onClick={() => setShow(!show)}>
            {show
                ? <ShowLogo></ShowLogo>
                : <HideLogo></HideLogo>}
        </button>
    </div>
}

