import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import { remarkHyphenate } from "./remark-plugins/remark-hyphenate.mjs";
import remarkUnwrapImages from "remark-unwrap-images";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import expressiveCode from "astro-expressive-code";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";

import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import glslify from "vite-plugin-glslify";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  site: "https://jfagerberg.me",
  vite: {
    plugins: [glslify()],
  },
  markdown: {
    remarkPlugins: [remarkHyphenate, remarkUnwrapImages, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    preact(),
    expressiveCode({
      plugins: [pluginCollapsibleSections()]
    }),
    mdx(),
    sitemap(),
    robotsTxt(),
  ],
});
