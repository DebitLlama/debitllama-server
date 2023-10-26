import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { SlackInviteBox } from "../../components/SlackInviteForm.tsx";
import { insertFeedback } from "../../lib/backend/plpgsql/rpc.ts";
import { State } from "../_middleware.ts";
export const handler: Handlers<any, State> = {
    async POST(req, ctx) {
        const form = await req.formData();
        const subject = form.get("subject") as string;
        const message = form.get("message") as string;
        const headers = new Headers();

        if (subject.length === 0 || message.length === 0) {
            headers.set("location", `/app/feedback?error=${"Unable to save feedback. Empty subject or message fields!"}`);
            return new Response(null, { status: 303, headers })
        }

        const { data: email, error } = await insertFeedback(ctx, { subject, message });

        if (error) {
            headers.set("location", `/app/feedback?error=${"Unable to save feedback"}`)
        } else {
            headers.set("location", `/app/feedback?success=${"Message sent!"}`)

        }
        return new Response(null, { status: 303, headers })
    },

    GET(_req, ctx) {
        return ctx.render({ ...ctx.state })
    }
}

export default function Feedback(props: PageProps) {
    const err = props.url.searchParams.get("error");
    const success = props.url.searchParams.get("success");

    return <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
        <div class="mt-10 px-5 mx-auto flex  flex-col justify-center">
            <div class="mx-auto text-center max-w-xl">
                <h1 class="text-5xl font-bold mb-5">Send Us Feedback</h1>

                <SlackInviteBox></SlackInviteBox>

                <form method={"POST"}>
                    <div class="relative mb-6" data-te-input-wrapper-init>
                        <input
                            type="text"
                            class="text-body-color border-[f0f0f0] focus:border-primary w-full resize-none rounded border py-3 px-[14px] text-base outline-none focus-visible:shadow-none"
                            id="feedbackSubject"
                            name="subject"
                            placeholder={"Subject"}
                            required
                        />

                    </div>
                    <p class="text-lg mb-5">Your message will be sent to our slack channel.</p>
                    {err && (
                        <div class="bg-red-400 border-l-4 p-4" role="alert">
                            <p class="font-bold">Something went wrong!</p>
                            <p>{err}</p>
                        </div>
                    )}
                    {success && (
                        <div class="bg-green-400 border-l-4 p-4" role="alert">
                            <p class="font-bold">Message Sent!</p>
                        </div>
                    )}
                    <div class="relative mb-6" data-te-input-wrapper-init>
                        <textarea
                            class="text-body-color border-[f0f0f0] focus:border-primary w-full resize-none rounded border py-3 px-[14px] text-base outline-none focus-visible:shadow-none"
                            id="feedbackMessage"
                            rows={3}
                            placeholder="Your message"
                            name="message"
                            required
                        ></textarea>

                    </div>
                    <button
                        aria-label={"Send feedback button"}
                        type="submit"
                        class="w-64 text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                        Send
                    </button>
                </form>


            </div>
        </div>
    </Layout>
}