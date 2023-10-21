
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
      </div>
    </>
  );
}