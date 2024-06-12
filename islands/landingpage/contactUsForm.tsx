import { useState } from "preact/hooks"

export function ContactUsForm() {
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [website, setWebsite] = useState("");

    return <div class="max-w-2xl dark:bg-gray-950 dark:text-white">
        <form class=" w-full p-4 rounded shadow-md" action="/submit-comment" method="post">
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
                        type="text"
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
        </form>
    </div>
}