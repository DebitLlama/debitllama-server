export default function SlacKInviteForm() {
    return <div class="flex flex-row justify-around gap-5 pt-10 pb-10 max-w-7xl mx-auto bg-gray-100">
        <div class="flex flex-row justify-around max-w-7xl flex-wrap gap-4">

            <div class="flex flex-col justify-center">
                <div class="flex flex-row justify-center text-center pb-5">
                    <h2 class="text-4xl font-bold text-gray-800 ">Do you have any questions? </h2>
                </div>
                <a href="https://debitllama.gitbook.io/debitllama/how-we-compare-to-others" class="mx-auto font-bold w-72 text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">See we compare to others!</a>
            </div>

            <SlackInviteBox></SlackInviteBox>
        </div>
    </div>
}

export function SlackInviteBox() {
    return <div class="border p-5 bg-white codeDisplayWidth" >
        <div class="flex flex-row justify-center text-center pb-5 gap-5">

            <a href="https://join.slack.com/t/debitllamasupport/shared_invite/zt-25qm4iycg-qPX_qMmurj~dxwDLhRaZ8g" target={"_blank"} class="flex flex-row justify-center text-xl font-bold mb-4 mt-4 text-white bg-indigo-700 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 rounded-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 indigobg" type="button">
                Join Workspace
            </a>
            <div class="w-36 flex flex-col justify-center">
                <img src="/slackLogo.webp" alt="Slack" class="mx-auto" width="inherit" height="inherit" />
            </div>
        </div>
    </div>
}