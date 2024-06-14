import { defineConfig } from "$fresh/server.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

const port = parseInt(Deno.env.get("PUP_CLUSTER_PORT") || "3000", 10);

export default defineConfig({
  plugins: [twindPlugin(twindConfig)],
  port,
});
