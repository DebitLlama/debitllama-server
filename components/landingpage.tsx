import { ChangingTitlePart } from "../islands/landingpage/changingTitle.tsx";

// Palette (kept as literals so the file works without touching your
// tailwind.config): ink #14171F, paper #F6F5F1, line #E4E1D8,
// muted text #5B5F6B, brand indigo #4338CA (spenders), signal green
// #0F9D6E (merchants / verified state).

export function SimpleLandingPage() {
    return (
        <div class="bg-[#F6F5F1]">
            <div class="fixed inset-x-0 top-0 z-50">
                <div class="bg-[#4338CA] px-4 py-2 text-center text-xs font-medium leading-5 text-white">
                    DebitLlama is going through an upgrade and migrating to the Arbitrum network — some functionality may not work.
                </div>
                <header class="border-b border-[#E4E1D8] bg-[#F6F5F1]">
                <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8" aria-label="Global">
                    <div class="flex items-center gap-2.5">
                        <img alt="DebitLlama logo" src="/logo.svg" width="32" height="32" />
                        <span class="text-lg font-bold tracking-tight text-[#14171F]">
                            Debit<span class="text-[#4338CA]">Llama</span>
                        </span>
                    </div>
                    <div class="flex items-center gap-6">
                        <a
                            href="https://debitllama.gitbook.io/debitllama"
                            class="hidden text-sm text-[#5B5F6B] hover:text-[#14171F] sm:block"
                        >
                            Docs
                        </a>
                        <a
                            href="/login"
                            class="rounded-md bg-[#14171F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4338CA]"
                        >
                            Log in
                        </a>
                    </div>
                </nav>
                </header>
            </div>

            <style>
                {`
                @keyframes dl-fade-up {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .dl-hero-fade {
                    animation: dl-fade-up 0.5s ease-out both;
                }
                @media (prefers-reduced-motion: reduce) {
                    .dl-hero-fade { animation: none; }
                }
                `}
            </style>

            <div class="relative isolate pt-32 sm:pt-28">
                <div class="mx-auto max-w-7xl px-6 lg:px-8">
                    <div class="grid grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
                        <div class="dl-hero-fade">
                            <h1 class="text-4xl font-bold tracking-tight text-[#14171F] sm:text-5xl">
                                Crypto subscriptions,
                                <br />
                                <span class="text-[#4338CA]">
                                    <ChangingTitlePart></ChangingTitlePart>
                                </span>
                                <span class="blinkStepStart text-[#4338CA]">|</span>
                            </h1>
                            <p class="mt-6 max-w-md text-lg leading-8 text-[#5B5F6B]">
                                AI Agent subscription economy with Smart contract accounts, wallet abstraction, and a checkout flow built for recurring, non-custodial payments.
                            </p>
                            <div class="mt-10 flex items-center gap-x-6">
                                <a
                                    href="/signup"
                                    class="rounded-md bg-[#4338CA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#312E81]"
                                >
                                    Sign up
                                </a>
                                <a
                                    href="https://debitllama.gitbook.io/debitllama"
                                    class="text-sm font-semibold text-[#14171F] underline decoration-[#DCD9D0] underline-offset-4 hover:decoration-[#4338CA]"
                                >
                                    Learn more
                                </a>
                            </div>
                        </div>
                        <DashboardScreenshotPic></DashboardScreenshotPic>
                    </div>
                </div>
            </div>

            <InfoSection></InfoSection>
            <ForSpendersSection></ForSpendersSection>
            <ForMerchantsSection></ForMerchantsSection>
            <McpAgentSection></McpAgentSection>
            <FAQSection></FAQSection>
            <SiteFooter></SiteFooter>
        </div>
    );
}

function DashboardScreenshotPic() {
    return (
        <figure class="overflow-hidden rounded-lg border border-[#E4E1D8] bg-white shadow-[0_1px_2px_rgba(20,23,31,0.06)]">
            <div class="flex items-center gap-1.5 border-b border-[#E4E1D8] bg-[#F6F5F1] px-4 py-2.5">
                <span class="h-2.5 w-2.5 rounded-full bg-[#E4E1D8]"></span>
                <span class="h-2.5 w-2.5 rounded-full bg-[#E4E1D8]"></span>
                <span class="h-2.5 w-2.5 rounded-full bg-[#E4E1D8]"></span>
            </div>
            <img class="w-full" width="800" height="auto" src="./Dashboard-Screenshot-new.webp" alt="DebitLlama dashboard" />
        </figure>
    );
}

export function InfoSection() {
    return (
        <section class="bg-[#F6F5F1] py-20">
            <div class="mx-auto max-w-3xl px-6 text-center lg:px-8">
                <h2 class="text-2xl font-bold tracking-tight text-[#14171F]">What is DebitLlama?</h2>
                <p class="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[#5B5F6B]">
                    A service for creating and managing future transactions with immutable constraints. It uses blockchain contracts with zero-knowledge proof cryptography, so transactions become valid over time until the proof is invalidated — whether you're a spender loading up an account, or a merchant getting paid from one.
                </p>
            </div>
        </section>
    );
}

const SPENDER_FEATURES = [
    {
        tag: "custody",
        title: "Non-custodial",
        body:
            "There is no custody, period. Funds are never locked or stored by third parties, they stay in your external owned wallet or in a smart-contract-based virtual account. Cancel every subscription and disconnect your wallet with a single transaction, any time. DebitLlama has no access to funds and cannot freeze, confiscate, or alter your subscriptions.",
    },
    {
        tag: "limits",
        title: "Always in control",
        body:
            "You can't get charged more than what you approved, no surprise fees, even with pay-per-use pricing. The maximum you can pay never changes. Spending limits are set at both the account and subscription level, and cryptography guarantees a subscription never exceeds the approved amount or frequency.",
    },
    {
        tag: "accounts",
        title: "Bespoke wallet abstractions",
        body:
            "Accounts support direct-debit pull payments, with meta-transactions relayed trustlessly by intent solvers. Creating an account depends on an active wallet, but once it exists, payments can be approved with just a password or a passkey — or by continuing to use Metamask. Spending approval and ownership are decoupled.",
    },
];

export function ForSpendersSection() {
    return (
        <section class="bg-[#F6F5F1] py-20">
            <div class="mx-auto max-w-5xl px-6 lg:px-8">
                <div class="flex items-baseline gap-3">
                    <span class="h-6 w-1 rounded-full bg-[#4338CA]"></span>
                    <h2 class="text-3xl font-bold tracking-tight text-[#14171F]">For spenders</h2>
                </div>
                <p class="mt-4 max-w-2xl text-[15px] leading-7 text-[#5B5F6B]">
                    Create an account, keep your funds where you can see them, and set the rules once — including letting an agent spend on your behalf without ever touching your wallet.
                </p>

                <div class="mt-10 divide-y divide-[#E4E1D8] rounded-lg border border-[#E4E1D8] bg-white">
                    {SPENDER_FEATURES.map((f) => (
                        <div class="grid grid-cols-1 gap-3 p-6 sm:grid-cols-[180px_1fr] sm:gap-8 sm:p-8">
                            <div>
                                <span class="font-mono text-xs text-[#4338CA]">{f.tag}</span>
                                <h3 class="mt-1 text-lg font-bold text-[#14171F]">{f.title}</h3>
                            </div>
                            <p class="text-[15px] leading-7 text-[#5B5F6B]">{f.body}</p>
                        </div>
                    ))}
                </div>

                <div class="mt-6">
                    <AgentAccountsSection></AgentAccountsSection>
                </div>
            </div>
        </section>
    );
}

export function AgentAccountsSection() {
    return (
        <div class="rounded-lg border border-[#E4E1D8] bg-white p-6 sm:p-8">
            <div class="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                    <span class="font-mono text-xs text-[#4338CA]">agents</span>
                    <h3 class="mt-1 text-lg font-bold text-[#14171F]">Let an agent spend, without handing over your wallet</h3>
                    <p class="mt-4 text-[15px] leading-7 text-[#5B5F6B]">
                        Create a virtual spending account, set a password on it, and top it up with however much you're comfortable handing over. Give the account and password to an AI agent, and it can complete any "Pay with DebitLlama" checkout on its own — but only up to the balance you already loaded in.
                    </p>
                    <ul class="mt-6 space-y-3 text-[15px] text-[#5B5F6B]">
                        <li class="flex gap-3">
                            <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#4338CA]"></span>
                            The account is separate from your main wallet — top it up manually with only what the agent should be able to spend.
                        </li>
                        <li class="flex gap-3">
                            <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#4338CA]"></span>
                            The agent authenticates with the account's password, so it can shop without you present for each purchase.
                        </li>
                        <li class="flex gap-3">
                            <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#4338CA]"></span>
                            Want a human in the loop instead? Connect a passkey or Metamask's public-key encryption, and every payment needs your manual touch to approve.
                        </li>
                    </ul>
                </div>

                <div class="rounded-lg border border-[#E4E1D8] bg-[#F6F5F1] p-6">
                    <div class="flex flex-col">
                        <div class="rounded-md border border-[#E4E1D8] bg-white px-4 py-3">
                            <span class="font-mono text-xs text-[#5B5F6B]">you</span>
                            <p class="text-sm font-semibold text-[#14171F]">Create the account and set a password</p>
                        </div>
                        <div class="ml-6 h-6 w-px bg-[#E4E1D8]"></div>
                        <div class="rounded-md border border-[#E4E1D8] bg-white px-4 py-3">
                            <span class="font-mono text-xs text-[#5B5F6B]">you</span>
                            <p class="text-sm font-semibold text-[#14171F]">Top it up manually</p>
                        </div>
                        <div class="ml-6 h-6 w-px bg-[#E4E1D8]"></div>
                        <div class="rounded-md border border-[#E4E1D8] bg-white px-4 py-3">
                            <span class="font-mono text-xs text-[#4338CA]">agent</span>
                            <p class="text-sm font-semibold text-[#14171F]">
                                Pays with the account + password at checkout, up to the balance loaded
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ForMerchantsSection() {
    return (
        <section class="bg-white py-20">
            <div class="mx-auto max-w-5xl px-6 lg:px-8">
                <div class="flex items-baseline gap-3">
                    <span class="h-6 w-1 rounded-full bg-[#0F9D6E]"></span>
                    <h2 class="text-3xl font-bold tracking-tight text-[#14171F]">For merchants</h2>
                </div>
                <p class="mt-4 max-w-2xl text-[15px] leading-7 text-[#5B5F6B]">
                    Accept recurring or dynamic payments without custody risk. Run your own relayer, pull payment data over REST, and embed a checkout button in minutes.
                </p>

                <div class="mt-10 space-y-10">
                    <DownloadLinks></DownloadLinks>
                    <RestApiSection></RestApiSection>
                    <SimpleCheckoutFlow></SimpleCheckoutFlow>
                </div>
            </div>
        </section>
    );
}

export function FeesInfoSection() {
    return (
        <section class="bg-white py-20">
            <div class="mx-auto max-w-3xl px-6 lg:px-8">
                <span class="font-mono text-xs text-[#0F9D6E]">pricing</span>
                <h2 class="mt-1 text-2xl font-bold tracking-tight text-[#14171F]">Direct debit payments</h2>
                <p class="mt-4 text-base leading-7 text-[#5B5F6B]">
                    The service charges a 5% fee on each successful direct debit in the smart contract. Fees are subject to change.
                </p>
                <p class="mt-4 text-base leading-7 text-[#5B5F6B]">
                    Set up your account once and approve payments from it on any device — Metamask, a password-based wallet abstraction, or a passkey.
                </p>
                <p class="mt-4 text-base leading-7 text-[#5B5F6B]">
                    DebitLlama is not a money transmitter. It does not custody funds or process blockchain transactions on behalf of users — it stores intents and provides an interface to fulfill them, and charges a fee for that interface. Registered subscription service providers process their own transactions and cover gas fees. If you want to sell a subscription service but don't know how to host a relayer and debit your customers, fill out the contact form below and we'll get back to you with hands-on support.
                </p>
            </div>
        </section>
    );
}

export function DownloadLinks() {
    return (
        <div class="rounded-lg border border-[#E4E1D8] bg-[#14171F] p-10 lg:p-16">
            <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
                <div>
                    <span class="font-mono text-xs text-[#9CE6C2]">solvers</span>
                    <h3 class="mt-1 text-2xl font-bold tracking-tight text-white">
                        Start accepting direct debit payments today.
                    </h3>
                    <p class="mt-4 text-base leading-7 text-[#B8BAC2]">
                        Pull payments automatically from your customers connected accounts by running your own relayer. Just set it, add gas and forget it.
                        
                        You can run it locally or in the cloud.
                    </p>
                    <div class="mt-8">
                        <a
                            href="https://debitllama.gitbook.io/debitllama/process-payments-via-solvers"
                            class="inline-block rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#14171F] transition-colors hover:bg-[#F6F5F1]"
                        >
                            Run a solver
                        </a>
                    </div>
                </div>
                <div class="overflow-hidden rounded-md border border-white/10 bg-black/30">
                    <div class="border-b border-white/10 px-4 py-2 font-mono text-xs text-[#8B8F99]">relayer setup</div>
                    <pre class="overflow-auto p-4 font-mono text-sm leading-7 text-[#9CE6C2]">
{`$ debitllama solver init
$ debitllama solver start --network mainnet
✓ listening for payment intents`}
                    </pre>
                </div>
            </div>
        </div>
    );
}

export function RestApiSection() {
    return (
        <div class="rounded-lg border border-[#E4E1D8] bg-[#F6F5F1] p-8 lg:p-10">
            <div class="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                    <span class="font-mono text-xs text-[#0F9D6E]">developer api</span>
                    <h3 class="mt-1 text-lg font-bold text-[#14171F]">
                        Request dynamic payments over REST
                    </h3>
                    <p class="mt-4 text-[15px] leading-7 text-[#5B5F6B]">
                        Beyond fixed-price subscriptions, the REST API lets a merchant request a variable amount against an existing payment intent — for metered usage, tips, or top-ups. Authenticate with an access token, submit the amount to debit, and the relayer picks it up on the next cycle.
                    </p>
                    <ul class="mt-6 space-y-3 text-[15px] text-[#5B5F6B]">
                        <li class="flex gap-3">
                            <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#0F9D6E]"></span>
                            Fetch any payment intent by its on-chain identifier, scoped by role — customer or merchant.
                        </li>
                        <li class="flex gap-3">
                            <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#0F9D6E]"></span>
                            Create or cancel a dynamic payment request as the payee, with a formatted ETH amount.
                        </li>
                        <li class="flex gap-3">
                            <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#0F9D6E]"></span>
                            Track it through created, locked, completed, or rejected — rejected if the account balance can't cover it.
                        </li>
                    </ul>
                    <div class="mt-8">
                        <a
                            href="https://debitllama.gitbook.io/debitllama/rest-api-v1"
                            class="text-sm font-semibold text-[#14171F] underline decoration-[#DCD9D0] underline-offset-4 hover:decoration-[#0F9D6E]"
                        >
                            Read the REST API docs
                        </a>
                    </div>
                </div>

                <div class="overflow-hidden rounded-lg border border-[#E4E1D8] bg-[#14171F]">
                    <div class="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                        <span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
                        <span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
                        <span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
                        <p class="ml-2 font-mono text-xs text-[#8B8F99]">POST /api/v1/payment_intents/[slug]</p>
                    </div>
                    <pre class="overflow-auto p-4 font-mono text-sm leading-6 text-[#9CE6C2]">
{`{
  "requested_debit_amount": "0.05"
}

→ { "result": { "message": "CREATEDREQUEST", "id": 482 } }`}
                    </pre>
                </div>
            </div>
        </div>
    );
}

export function SimpleCheckoutFlow() {
    return (
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div class="flex flex-col justify-center rounded-lg border border-[#E4E1D8] bg-white p-8">
                <span class="font-mono text-xs text-[#0F9D6E]">checkout</span>
                <h3 class="mt-1 text-lg font-bold text-[#14171F]">Simple checkout integration</h3>
                <p class="mt-2 text-sm leading-6 text-[#5B5F6B]">Drop a single link and image onto your product page. Supports both human and agentic checkout flow.</p>
                <img
                    alt="Buy It Now with DebitLlama"
                    src="/buyitnow.png"
                    width="150"
                    height="inherit"
                    class="mt-6"
                />
            </div>

            <div class="overflow-hidden rounded-lg border border-[#E4E1D8] bg-[#14171F] shadow-sm">
                <div class="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                    <span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
                    <span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
                    <span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
                    <p class="ml-2 font-mono text-xs text-[#8B8F99]">embed on your website</p>
                </div>
                <div class="h-56 overflow-auto px-4 py-4">
                    <pre class="whitespace-pre-wrap break-all font-mono text-sm leading-6">
                        <span class="text-[#E9967A]">{`<a`}</span>{"\n "}
                        <span class="text-[#9CE6C2]">href="</span>
                        <span class="text-white">{`https://debitllama.com/buyitnow/?q=`}</span>
                        <span class="text-[#F0A0A0]">{`<IDENTIFIER>`}</span>
                        <span class="text-[#9CE6C2]">"</span>
                        <span class="text-[#E9967A]">{`>\n `}</span>
                        <span class="text-[#E9967A]">{`<img `}</span>
                        <span class="text-white">{`\n  `}</span>
                        <span class="text-[#9CE6C2]">width="</span>
                        <span class="text-white">{`140px`}</span>
                        <span class="text-[#9CE6C2]">"{`\n  `}</span>
                        <span class="text-[#9CE6C2]">alt="</span>
                        <span class="text-white">{`Buy it now with DebitLlama`}</span>
                        <span class="text-[#9CE6C2]">"{`\n  `}</span>
                        <span class="text-[#9CE6C2]">src="</span>
                        <span class="text-white">{`https://debitllama.com/buyitnow.png`}</span>
                        <span class="text-[#9CE6C2]">"</span>
                        <span class="text-[#E9967A]">{`/>\n`}</span>
                        <span class="text-[#E9967A]">{`</a>`}</span>
                    </pre>
                </div>
            </div>
        </div>
    );
}

// --- MCP server for agents / AgentPay -------------------------------------

export function McpAgentSection() {
    return (
        <section class="bg-[#14171F] py-20">
            <div class="mx-auto max-w-5xl px-6 lg:px-8">
                <div class="flex items-baseline gap-3">
                    <span class="h-6 w-1 rounded-full bg-[#8B8FE6]"></span>
                    <h2 class="text-3xl font-bold tracking-tight text-white">MCP server for agents</h2>
                </div>
                <p class="mt-4 max-w-2xl text-[15px] leading-7 text-[#B8BAC2]">
                    <span class="font-semibold text-white">debitllama-mcp</span> puts the REST API behind a Model Context
                    Protocol server, so an agent doesn't need custom integration code to transact — it just calls the
                    tools. List items for sale, discover what other agents are offering, create or accept a payment
                    intent, and approve a subscription, all as native MCP calls.
                </p>

                <div class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div class="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                        <span class="font-mono text-xs text-[#8B8FE6]">agentpay</span>
                        <h3 class="mt-1 text-base font-bold text-white">Hand an agent the keys, on purpose</h3>
                        <p class="mt-3 text-sm leading-6 text-[#B8BAC2]">
                            AgentPay connects debitllama-mcp directly to one of your accounts. Once linked, the agent
                            authenticates as that account and can approve, adjust, or cancel its own subscriptions —
                            no human click-through required, still bounded by the balance and limits you set when you
                            created it.
                        </p>
                    </div>
                    <div class="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                        <span class="font-mono text-xs text-[#8B8FE6]">listings</span>
                        <h3 class="mt-1 text-base font-bold text-white">Agents can sell, too</h3>
                        <p class="mt-3 text-sm leading-6 text-[#B8BAC2]">
                            The same API surface an agent uses to pay also lets it publish: create a new item or
                            subscription plan, price it, and put it up for other agents to find — no dashboard, no
                            merchant onboarding call.
                        </p>
                    </div>
                    <div class="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                        <span class="font-mono text-xs text-[#8B8FE6]">agent-to-agent</span>
                        <h3 class="mt-1 text-base font-bold text-white">A marketplace with no humans in the loop</h3>
                        <p class="mt-3 text-sm leading-6 text-[#B8BAC2]">
                            Because both sides of the API are open to agents, one agent's listing can become another
                            agent's subscription. Payment intents get created, accepted, and settled machine-to-machine,
                            with the same on-chain limits protecting everyone involved.
                        </p>
                    </div>
                </div>

                <div class="mt-10 rounded-lg border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                    <span class="font-mono text-xs text-[#8B8FE6]">how it connects</span>
                    <h3 class="mt-1 text-base font-bold text-white">Agents subscribing to each other</h3>
                    <p class="mt-3 max-w-2xl text-sm leading-6 text-[#B8BAC2]">
                        Each agent runs its own local debitllama-mcp server, wired to an account it controls — there's no shared or remote MCP service in between. From there it
                        can list a service, subscribe to another agent's listing, or both — the diagram below shows
                        three agents doing all three at once.
                    </p>
                    <div class="mt-8">
                        <AgentSubscriptionDiagram></AgentSubscriptionDiagram>
                    </div>
                </div>
            </div>
        </section>
    );
}

function AgentSubscriptionDiagram() {
    return (
        <svg
            viewBox="0 0 700 480"
            xmlns="http://www.w3.org/2000/svg"
            class="w-full"
            role="img"
            aria-label="Diagram showing three agents, each running its own local debitllama-mcp server, subscribing to one another directly in a cycle"
        >
            <defs>
                <marker id="dl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill="#8B8FE6" />
                </marker>
                <marker id="dl-arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill="#0F9D6E" />
                </marker>
            </defs>

            {/* Agent A - top left, with its own local mcp server */}
            <circle cx="150" cy="90" r="46" fill="#1E2230" stroke="#8B8FE6" stroke-width="2" />
            <text x="150" y="86" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="white">Agent A</text>
            <text x="150" y="101" text-anchor="middle" font-family="monospace" font-size="9" fill="#8B8F99">sells research</text>
            <line x1="118" y1="60" x2="72" y2="32" stroke="#4B4F5C" stroke-width="1.5" stroke-dasharray="3 4" />
            <rect x="14" y="14" width="96" height="30" rx="6" fill="#1E2230" stroke="#4B4F5C" stroke-width="1.5" />
            <circle cx="28" cy="29" r="3" fill="#8B8FE6" />
            <text x="66" y="33" text-anchor="middle" font-family="monospace" font-size="9" fill="#B8BAC2">local mcp</text>

            {/* Agent B - top right, with its own local mcp server */}
            <circle cx="550" cy="90" r="46" fill="#1E2230" stroke="#8B8FE6" stroke-width="2" />
            <text x="550" y="86" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="white">Agent B</text>
            <text x="550" y="101" text-anchor="middle" font-family="monospace" font-size="9" fill="#8B8F99">sells compute</text>
            <line x1="582" y1="60" x2="628" y2="32" stroke="#4B4F5C" stroke-width="1.5" stroke-dasharray="3 4" />
            <rect x="590" y="14" width="96" height="30" rx="6" fill="#1E2230" stroke="#4B4F5C" stroke-width="1.5" />
            <circle cx="604" cy="29" r="3" fill="#8B8FE6" />
            <text x="642" y="33" text-anchor="middle" font-family="monospace" font-size="9" fill="#B8BAC2">local mcp</text>

            {/* Agent C - bottom center, with its own local mcp server */}
            <circle cx="350" cy="370" r="46" fill="#1E2230" stroke="#8B8FE6" stroke-width="2" />
            <text x="350" y="366" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="white">Agent C</text>
            <text x="350" y="381" text-anchor="middle" font-family="monospace" font-size="9" fill="#8B8F99">sells data feeds</text>
            <line x1="350" y1="416" x2="350" y2="434" stroke="#4B4F5C" stroke-width="1.5" stroke-dasharray="3 4" />
            <rect x="302" y="434" width="96" height="26" rx="6" fill="#1E2230" stroke="#4B4F5C" stroke-width="1.5" />
            <circle cx="316" cy="447" r="3" fill="#8B8FE6" />
            <text x="356" y="451" text-anchor="middle" font-family="monospace" font-size="9" fill="#B8BAC2">local mcp</text>

            {/* subscription arrows, curved, forming a cycle: A -> B -> C -> A */}
            <path d="M 196 78 C 300 30, 400 30, 504 78" fill="none" stroke="#0F9D6E" stroke-width="2" marker-end="url(#dl-arrow-green)" />
            <text x="350" y="40" text-anchor="middle" font-family="monospace" font-size="10" fill="#9CE6C2">subscribes</text>

            <path d="M 538 130 C 520 230, 440 300, 385 345" fill="none" stroke="#0F9D6E" stroke-width="2" marker-end="url(#dl-arrow-green)" />
            <text x="505" y="245" text-anchor="middle" font-family="monospace" font-size="10" fill="#9CE6C2" transform="rotate(63 505 245)">subscribes</text>

            <path d="M 315 345 C 260 300, 180 230, 162 130" fill="none" stroke="#0F9D6E" stroke-width="2" marker-end="url(#dl-arrow-green)" />
            <text x="195" y="245" text-anchor="middle" font-family="monospace" font-size="10" fill="#9CE6C2" transform="rotate(-63 195 245)">subscribes</text>

            <text x="350" y="472" text-anchor="middle" font-family="monospace" font-size="9" fill="#6B6F79">
                dashed = each agent's own local mcp server · green = subscription payment intents, agent to agent
            </text>
        </svg>
    );
}

const FAQS = [
    {
        q: "Who holds my funds?",
        a: "You do. Deposits stay in your own wallet or in a smart-contract-based virtual account you control — DebitLlama never takes custody and can't freeze, move, or confiscate a balance.",
    },
    {
        q: "Can a merchant charge me more than I approved?",
        a: "No. Every subscription is bound to a maximum amount and frequency at the contract level. A merchant can only ever pull what you've explicitly approved, and never more often than you've allowed.",
    },
    {
        q: "How do I cancel?",
        a: "Cancel a single subscription, or disconnect your wallet entirely, with one transaction from your dashboard. There's no support ticket or waiting period — it settles on-chain immediately.",
    },
    {
        q: "What wallets are supported?",
        a: "Metamask and other standard EOA wallets work out of the box. You can also approve payments with just a password or a passkey once an account exists, without touching a browser extension.",
    },
    {
        q: "Who pays the gas fees?",
        a: "Subscription providers run their own relayer (or an intent solver) and cover gas for the transactions they process. DebitLlama takes a small fee on successful direct debits for providing the interface.",
    },
    {
        q: "What can an agent do with AgentPay?",
        a: "Once debitllama-mcp is connected to an account, an agent can approve, adjust, or cancel that account's subscriptions, and — through the same API — list its own items or plans for other agents to subscribe to. It's still bounded by whatever balance and limits you set on the account.",
    },
];

export function FAQSection() {
    return (
        <section class="bg-[#F6F5F1] py-20">
            <div class="mx-auto max-w-3xl px-6 lg:px-8">
                <h2 class="text-2xl font-bold tracking-tight text-[#14171F]">Questions people ask</h2>
                <div class="mt-10 divide-y divide-[#E4E1D8] border-t border-[#E4E1D8]">
                    {FAQS.map((item) => (
                        <details class="group py-6">
                            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                                <span class="text-base font-semibold text-[#14171F]">{item.q}</span>
                                <span class="shrink-0 text-lg text-[#5B5F6B] transition-transform group-open:rotate-45">+</span>
                            </summary>
                            <p class="mt-3 max-w-2xl text-[15px] leading-7 text-[#5B5F6B]">{item.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

const FOOTER_LINKS = {
    Product: [
        { label: "Sign up", href: "/signup" },
        { label: "Log in", href: "/login" },
        { label: "Pricing", href: "#" },
    ],
    Developers: [
        { label: "Documentation", href: "https://debitllama.gitbook.io/debitllama" },
        { label: "Run a solver", href: "https://debitllama.gitbook.io/debitllama/process-payments-via-solvers" },
        { label: "GitHub", href: "https://github.com/" },
    ],
    Company: [
        { label: "Contact", href: "mailto:hello@debitllama.com" },
        { label: "Twitter / X", href: "#" },
        { label: "Terms", href: "#" },
    ],
};

export function SiteFooter() {
    return (
        <footer class="border-t border-[#E4E1D8] bg-[#14171F]">
            <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div class="flex items-center gap-2.5">
                            <img alt="DebitLlama logo" src="/logo.svg" width="28" height="28" />
                            <span class="text-base font-bold tracking-tight text-white">
                                Debit<span class="text-[#8B8FE6]">Llama</span>
                            </span>
                        </div>
                        <p class="mt-4 max-w-xs text-sm leading-6 text-[#8B8F99]">
                            Non-custodial recurring payments for crypto, built on smart contract accounts and wallet abstraction.
                        </p>
                    </div>
                    {Object.entries(FOOTER_LINKS).map(([section, links]) => (
                        <div>
                            <h3 class="text-sm font-semibold text-white">{section}</h3>
                            <ul class="mt-4 space-y-3">
                                {links.map((link) => (
                                    <li>
                                        <a href={link.href} class="text-sm text-[#8B8F99] transition-colors hover:text-white">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div class="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
                    <p class="font-mono text-xs text-[#6B6F79]">DebitLlama, {new Date().getFullYear()}</p>
                    <div class="flex items-center gap-2 font-mono text-xs text-[#6B6F79]">
                        <span class="h-1 w-1 rounded-full bg-[#0F9D6E]"></span>
                        non-custodial · no lock-up · cancel any time
                    </div>
                </div>
            </div>
        </footer>
    );
}