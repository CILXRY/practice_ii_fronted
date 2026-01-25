import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import UnoCSS from "unocss/astro";

export default defineConfig({
  integrations: [UnoCSS(), vue()],
});
