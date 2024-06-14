import { Head } from "$fresh/runtime.ts";
import { SimpleLandingPage } from "../components/landingpage.tsx";
import { Handlers } from "$fresh/server.ts";
import { State } from "./_middleware.ts";
import { single_is_rateLimited } from "../lib/backend/ratelimiter.ts";
import { enqueueSalesEmail } from "../lib/backend/queue/kv.ts";

export const handler: Handlers<any, State> = {
    async POST(req, ctx) {
        const isRateLimited = await single_is_rateLimited(ctx.remoteAddr.hostname, "contactForm")

        if (isRateLimited) {
            return new Response(null, {
                status: 429
            })
        }

        const json = await req.json()
        const message = json.message;
        const name = json.name;
        const email = json.email;
        const website = json.website;

        if (!message || message.length === 0) {
            return badrequest("message")
        }
        if (!name || name.length === 0) {
            return badrequest("name")
        }
        if (!email || email.length === 0) {
            return badrequest("email")
        }
        if (!website || website.length === 0) {
            return badrequest("website")
        }

        //Enqueue an email to the sales team
        await enqueueSalesEmail({
            name,
            message,
            email,
            website
        })
        return new Response(null, {
            status: 200,

        })
    }
}

function badrequest(paramname: string) {
    return new Response(`Invalid ${paramname}`, {
        status: 400
    })
}

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
                <SimpleLandingPage />
            </div >
        </html>
    </>
}

