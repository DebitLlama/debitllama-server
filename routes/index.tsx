import { Head } from "$fresh/runtime.ts";
import SlacKInviteForm from "../components/SlackInviteForm.tsx";
import { BuiltWithInfoSection, FeatureMarquee, HeaderRow, HeaderRowWithLogin, LearnMoreInfoSection, MainTitleSection, MakePaymentsInfoSection, MultipleSecurityLayersInfoSection, NonInteractivePaymentsInfoSection, OpenApiToCustomPaymentsInfoSection, ScalableIntentSolversInfoSection, SimpleCheckoutFlowInfoSection, SimpleLandingPage } from "./landingpage/components.tsx";

export default function Home() {
    return <>
        <html lang="en">
            <Head>
                <title>DebitLlama</title>
                <link rel="stylesheet" href="/home.css" />
                <link rel="stylesheet" href="/styles.css" />
                <meta name="description" content="DebitLlama - Subscription Payments" />
            </Head>

            <div>
                {/* <HeaderRowWithLogin></HeaderRowWithLogin> */}
                <SimpleLandingPage />
                {/* <FeatureMarquee></FeatureMarquee> */}
                {/* <MainTitleSection></MainTitleSection> */}

                {/* <MakePaymentsInfoSection></MakePaymentsInfoSection> */}
                {/* <TwoColumnTitle></TwoColumnTitle> */}
                {/* <ScalableIntentSolversInfoSection></ScalableIntentSolversInfoSection> */}
                {/* <BuiltWithInfoSection></BuiltWithInfoSection> */}
                {/* <NonInteractivePaymentsInfoSection></NonInteractivePaymentsInfoSection> */}
                {/* <MultipleSecurityLayersInfoSection></MultipleSecurityLayersInfoSection> */}
                {/* <SimpleCheckoutFlowInfoSection></SimpleCheckoutFlowInfoSection> */}
                {/* TODO: Move the see how we compare to others to a separate component from the SlackInviteForm */}
                {/* <SlacKInviteForm></SlacKInviteForm> */}

                {/* <OpenApiToCustomPaymentsInfoSection></OpenApiToCustomPaymentsInfoSection> */}
                {/* <LearnMoreInfoSection></LearnMoreInfoSection> */}


            </div >
        </html>
    </>
}

