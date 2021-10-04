const withMDX = require("@next/mdx")({
    extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(frag|vert|glsl)$/,
            type: "asset/source",
        });
        return config;
    },
    pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
};

module.exports = withMDX({
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
    },
    ...nextConfig,
});
