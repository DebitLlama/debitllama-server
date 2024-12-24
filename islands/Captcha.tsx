import { useSignal } from "@preact/signals";
import CfTurnstile from "$turnstile/components/CfTurnstile.tsx";;
import { IS_BROWSER } from "$fresh/runtime.ts";


export default function Captcha(props: any) {
    const response = useSignal("");

    if (!IS_BROWSER) {
        return <div></div>
    }

    return <div>
        <CfTurnstile theme="light" sitekey={props.sitekey} {...props} callback={(token) => response.value = token} />
        <pre>{response}</pre>
    </div>
}