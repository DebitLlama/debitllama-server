
import { Head } from "$fresh/runtime.ts";
import type { ComponentChildren } from "preact";
import Nav from "./Nav.tsx";
import SideBar from "../islands/Sidebar.tsx";

interface LayoutProps {
  isLoggedIn: boolean;
  renderSidebarOpen: string;
  children: ComponentChildren;
}

export default function Layout(props: LayoutProps) {
  return (
    <>
      <Head>
        <title>DebitLlama</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/zxcvbn.js"></script>
        <script src="/directdebit_bundle.js"></script>
      </Head>
      <Nav loggedIn={props.isLoggedIn} />
      <SideBar renderSidebarOpen={props.renderSidebarOpen}></SideBar>
      <div class="mx-auto layoutheight overflow-auto" id="layout-children">
        {props.children}
        <footer
          class="border-grey-200 bg-neutral-200 text-center dark:bg-neutral-700 lg:text-left">
          <div class="pt-4 text-center text-neutral-700 dark:text-neutral-200 flex flex-col">
            © ZKP Tech Solutions Ltd 2023{" "}
            <div >
              <a
                class="w-64 text-gray-500 hover:text-gray-700 py-1 border-gray-500"
                href="/app/feedback"
              >Feedback</a>
            </div>
          </div>
        </footer>
      </div>

    </>
  );
}