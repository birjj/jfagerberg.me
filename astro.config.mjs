import { defineConfig } from "astro/config";
import { remarkHyphenate } from "./remark-plugins/remark-hyphenate.mjs";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  experimental: {
    assets: true,
  },
  markdown: {
    remarkPlugins: [remarkHyphenate],
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
