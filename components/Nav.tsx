interface NavProps {
    loggedIn: boolean
}
export default function Nav({ loggedIn }: NavProps) {


    const loggedInMenus = [
        { name: "Accounts", href: "/app/accounts" },
        { name: "Debit", href: "/app/debitItems" },
        { name: "Profile", href: "/app/profile" },
        { name: "Logout", href: "/logout" },
    ];

    const nonLoggedInMenus = [
        { name: "Login", href: "/   " },
        { name: "SignUp", href: "/signup" },
    ]

    return (
        <div class="bg-white max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div class="text-2xl  ml-1 font-bold flex flex-row">
                <img src="/logo.svg" width="45" class={"mr-3"} />{" "}
                <span class="mt-1">Debit</span><span class="text-gray-600 mt-1">Llama</span>
            </div>
            <ul class="flex gap-6">
                {
                    loggedIn ? (
                        loggedInMenus.map((menu) => (
                            <li>
                                <a
                                    href={menu.href}
                                    class="text-lg text-gray-500 hover:text-gray-700 py-1 border-gray-500"
                                >
                                    {menu.name}
                                </a>
                            </li>
                        ))
                    ) : (
                        nonLoggedInMenus.map((menu) => (
                            <li>
                                <a
                                    href={menu.href}
                                    class="text-lg text-gray-500 hover:text-gray-700 py-1 border-gray-500"
                                >
                                    {menu.name}
                                </a>
                            </li>
                        ))
                    )
                }
            </ul>
        </div>
    );
}