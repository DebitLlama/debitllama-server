
import { Head } from "$fresh/runtime.ts";
import type { ComponentChildren } from "preact";
import Nav from "./Nav.tsx";
import SideBar from "../islands/Sidebar.tsx";

interface LayoutProps {
  isLoggedIn: boolean;
  renderSidebarOpen: string;
  children: ComponentChildren;
  url: string;
}

export default function Layout(props: LayoutProps) {
  const pathname = new URL(props.url).pathname;
  const injectDeps = pathname === "/app/newConnectedWallet" || pathname === "/app/addNewAccount"

  return (
    <>
      <html lang="en">
        <Head>
          <title>DebitLlama</title>
          <link rel="stylesheet" href="/styles.css" />
          <meta name="description" content="DebitLlama - Subscription Payments" />
        </Head>
        <body>
          <Nav loggedIn={props.isLoggedIn} />
          <SideBar renderSidebarOpen={props.renderSidebarOpen}></SideBar>
          <div class="mx-auto layoutheight overflow-auto" id="layout-children">
            {props.children}
          </div>
          {injectDeps ? <script src="/zxcvbn.js" defer></script>
            : <></>}
          {injectDeps ? <script src="/directdebit_bundle.js" defer></script>
            : <></>}
        </body>
      </html>
    </>
  );
}