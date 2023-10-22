import { setSidebarOpenCookie } from "../lib/frontend/other.ts";

export default function SidebarToggleButton() {
    const toggleSidebar = () => {
        const sidebar = document.getElementById("sidebar-id");
        if (sidebar?.classList.contains("collapsed")) {
            sidebar.classList.remove("collapsed")
            setSidebarOpenCookie("true");
        } else {
            sidebar?.classList.add("collapsed");
            setSidebarOpenCookie("false");

        }
    }
    return <button
        aria-label="Sidebar trigger button"
        class="text-gray-600 w-10 h-10 rounded-full hover:bg-gray-200 shadow-2xl active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none" onClick={toggleSidebar}>
        <MenuIcon></MenuIcon>
    </button>
}

function MenuIcon() {
    return <svg
        fill="currentColor"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 -960 960 960"
        width="24"
        class="mx-auto"
    >
        <path
            d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
    </svg>
}