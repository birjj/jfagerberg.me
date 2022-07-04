/** @type {import('next').NextConfig} */
const config = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ["ts-shader-loader"],
    });

    return config;
  },
};
export default config;
