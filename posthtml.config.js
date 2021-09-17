const path = require("path");

const components = {
    "picture-grid": path.resolve(
        __dirname,
        "./src/_web-components/picture-grid.js"
    ),
};

module.exports = {
    plugins: {
        "posthtml-modules": {
            root: "./src",
        },
        "posthtml-link-noreferrer": {
            root: "./src",
            attr: ["noopener", "noreferrer"],
        },
        "posthtml-markdown": {
            root: "./src",
        },
        "posthtml-plugin-static-react": {
            ...components,
        },
        "posthtml-plugin-sharp": {
            root: "./src",
            outputDir: "_resized-imgs",
            maxWidth: 800,
            shouldApply(node) {
                return node.attrs && node.attrs.blurup !== undefined;
            },
            pathTransform(path) {
                return `~/src${path}`;
            }
        },
    },
};
