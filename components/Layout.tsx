
import { Head } from "$fresh/runtime.ts";
import type { ComponentChildren } from "preact";
import Nav from "./Nav.tsx";

interface LayoutProps {
  isLoggedIn: boolean;
  children: ComponentChildren;
}

export default function Layout(props: LayoutProps) {
  return (
    <>
      <Head>
        <title>DebitLlama</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/zxcvbn.js"></script>
      </Head>
      <Nav loggedIn={props.isLoggedIn} />
      <div class="p-4 mx-auto max-w-screen-md">
        {props.children}
      </div>
      <footer
        class="bg-neutral-200 text-center dark:bg-neutral-700 lg:text-left">
        <div class="p-4 text-center text-neutral-700 dark:text-neutral-200 flex flex-col">
          © ZKP Tech Solutions Ltd 2023 Copyright {" "}
          <a
            class="text-gray-500 hover:text-gray-700 py-1 border-gray-500"
            href="/app/feedback"
          >Feedback</a>
        </div>
      </footer>
    </>
  );
}