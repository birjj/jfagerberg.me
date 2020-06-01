// @ts-check
const sharp = require("sharp");
const matchHelper = require("posthtml-match-helper");
const fluid = require("./src/sizes");
const apply = require("./src/image");

const render = require("posthtml-render");

/** @typedef {import("./src/image.js").ImageOptions} ImageOptions */
/** @typedef {import("./src/sizes.js").FluidOptions} FluidOptions */
/** @typedef {import("./src/sharp.js").SharpOptions} SharpOptions */
/**
 * @typedef Options
 * @property {string} [matcher] CSS selector to use for finding targets
 */
/** @typedef {ImageOptions & FluidOptions & SharpOptions & Options} GlobalOptions */
const DEFAULT_OPTS = {
    shouldApply: (node) => node.attrs && node.attrs.blurup,
    matcher: "img",
};

/** Replaces images with Medium-like blur up versions
 * @param {GlobalOptions} options */
module.exports = function (options = {}) {
    const opts = { ...DEFAULT_OPTS, ...options };
    const matcher = matchHelper(opts.matcher);

    return function posthtmlSharp(tree) {
        return new Promise((res, rej) => {
            const nodePromises = [];
            tree.match(matcher, (node) => {
                const outpNode = {};
                const nodePromise = apply(node, opts).then((replacement) => {
                    Object.keys(replacement).forEach(
                        (key) => (outpNode[key] = replacement[key])
                    );
                });
                nodePromises.push(nodePromise);
                return outpNode;
            });
            Promise.all(nodePromises)
                .then(() => res(tree))
                .catch(rej);
        });
    };
};
