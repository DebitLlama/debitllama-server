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
        <div class="sticky top-0 z-50 bg-gray-50 flex flex-wrap items-center justify-between mx-auto px-4 pt-4 pb-2 shadow-md	">
            <div class="text-2xl  ml-1 font-bold flex flex-row">
                <img src="/logo.svg" width="45" class={"mr-3"} />{" "}
                <span class="mt-1">Debit</span><span class="text-gray-600 mt-1">Llama</span>
            </div>
            <ul class="flex gap-4 mb-1 mt-2">
                {
                    loggedIn ? (
                        loggedInMenus.map((menu) => (
                            <li>
                                <a
                                    href={menu.href}
                                    class="rounded-md bg-gray-200 hover:bg-gray-400 text-lg text-gray-600 hover:text-gray-950 border-gray-500 p-2"
                                >
                                    {renderMenuButton(menu.name)}
                                </a>
                            </li>
                        ))
                    ) : (
                        nonLoggedInMenus.map((menu) => (
                            <li>
                                <a
                                    href={menu.href}
                                    class="rounded-md bg-gray-200 hover:bg-gray-400 text-lg text-gray-600 hover:text-gray-950 border-gray-500 p-2"
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

function renderMenuButton(menuName: string) {
    switch (menuName) {
        case "Accounts":
            return menuName;
        case "Debit":
            return menuName
        case "Profile":
            return menuName
        case "Logout":
            return menuName
        case "Login":
            return menuName
        case "SignUp":
            return menuName
        default:
            return menuName
    }
}

function getLogoutLogo() {
    return <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" /></svg>;
}