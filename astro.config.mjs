import { defineConfig } from "astro/config";
import { remarkHyphenate } from "./remark-plugins/remark-hyphenate.mjs";
import remarkUnwrapImages from "remark-unwrap-images";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import expressiveCode from "astro-expressive-code";
import glslify from "vite-plugin-glslify";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  experimental: {
    assets: true,
  },
  vite: {
    plugins: [glslify()],
  },
  markdown: {
    remarkPlugins: [remarkHyphenate, remarkUnwrapImages],
  },
  mdx: {
    remarkPlugins: [remarkHyphenate, remarkUnwrapImages],
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    preact(),
    expressiveCode(),
    mdx(),
  ],
});
