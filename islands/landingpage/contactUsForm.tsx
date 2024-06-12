import { useState } from "preact/hooks"

type ContactResult = { status: "none" | "sent" | "err", msg: string }

export function ContactUsForm() {

    const [contactResult, setContactResult] = useState<ContactResult>({ status: "none", msg: "" });

    async function onSubmit(event: any) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const message = formData.get("message") as string;
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const website = formData.get("website") as string;

        const res = await fetch("/", {
            method: "POST",
            body: JSON.stringify({ message, name, email, website }),
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (res.status === 200) {
            setContactResult({ status: "sent", msg: "Message Sent! We will email you as soon as possible." })
        } else if (res.status === 429) {
            setContactResult({ status: "err", msg: "Too many requests send from this IP address. Try again in 10 minutes." })
        } else {
            setContactResult({ status: "err", msg: "Unable to send the message" })
        }

        return false;
    }


    return <div class="max-w-2xl dark:bg-gray-950 dark:text-white">
        <form class=" w-full p-4 rounded shadow-md" onSubmit={onSubmit} method="post">
            <h2 class="text-xl mb-4 tracking-wider font-lighter text-gray-900 dark:text-gray-200">Contact us</h2>
            <p class="text-gray-600 mb-4">If you are interested in adding Crypto Direct Debit payment to your application, let us know. We will fund and scale the relayers depending on your demand. Would you like to use a different network or support a new currency? Send a message and we will tailor the application to your needs with no upfront costs.</p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="mb-4 col-span-1 md:col-span-3">
                    <textarea
                        id="message"
                        name="message"
                        class="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed resize-none"
                        placeholder="Type Message...*"
                        rows={5}
                        required
                    ></textarea>
                </div>

                <div class="mb-4">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        class="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed"
                        placeholder="Name*"
                        required
                    />
                </div>
                <div class="mb-4">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        class="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed"
                        placeholder="Email*"
                        required
                    />
                </div>
                <div class="mb-4">
                    <input
                        type="url"
                        id="website"
                        name="website"
                        class="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed"
                        placeholder="Website"
                    />
                </div>
            </div>
            <div class="flex justify-end">
                <button
                    type="submit"
                    class="font-bold w-42  indigobg focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg  px-5 py-2.5 text-center "
                >
                    Send Message →
                </button>
            </div>
            <DisplayNotification contactResult={contactResult}></DisplayNotification>
        </form>
    </div>
}

function DisplayNotification(props: { contactResult: ContactResult }) {
    switch (props.contactResult.status) {
        case "none":
            return <div></div>
        case "err":
            return <p class="text-red-400">{props.contactResult.msg}</p>
        case "sent":
            return <p class="text-indigo-400">{props.contactResult.msg}</p>
    }
}