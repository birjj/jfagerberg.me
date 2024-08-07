import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { remarkHyphenate } from "./remark-plugins/remark-hyphenate.mjs";
import remarkUnwrapImages from "remark-unwrap-images";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import expressiveCode from "astro-expressive-code";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: "https://jfagerberg.me",
  markdown: {
    remarkPlugins: [remarkUnwrapImages, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  image: {
    domains: ["images.unsplash.com"],
  },
  integrations: [
    expressiveCode({
      themes: ["github-dark", "github-light"],
    }),
    mdx(),
    sitemap(),
    robotsTxt(),
    preact(),
  ],
});
