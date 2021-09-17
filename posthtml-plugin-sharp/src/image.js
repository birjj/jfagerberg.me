// @ts-check
const fs = require("fs-extra");
const path = require("path");
const render = require("posthtml-render");
const { fluid, placeholder } = require("./sizes");
const { removeKeys } = require("./utils");

/**
 * @typedef ImageOptions
 * @property {string} [root] If set, resolve relative paths relative to this directory. Defaults to process.cwd()
 * @property {boolean} [linkify=true] Can be set to false to avoid wrapping output <picture> in an anchor pointing to the original image.
 * @property {(node, opts) => boolean} [shouldApply] Should return whether we should apply our function to a given node. Default checks for `blurup` attribute.
 * @property {(node, opts) => string} [extractSrcPath] Get the src path of a node. Defaults to one that supports <img>.
 * @property {(path, opts) => string} [pathTransform] If you require the output paths to be in a particular format, use this to transform them. The given path will be relative to root.
 */
const DEFAULT_OPTS = {
    root: "./",
    linkify: true,
    shouldApply,
    extractSrcPath,
    pathTransform: v => v,
};

/** Extract src path from a posthtml node */
function extractSrcPath(node, opts) {
    return node.attrs ? node.attrs.src : "";
}

/** Generates the replacement node for an <img> */
function generateReplacement(node, outputs, originalSrc, bgOutput, opts) {
    const originalAttrs = node.attrs || {};
    const $img = {
        tag: "img",
        attrs: {
            ...removeKeys(originalAttrs, ["blurup"]),
            class: `blurup ${originalAttrs.class || ""}`,
            src: opts.pathTransform(originalSrc),
            srcset: outputs
                .map((output) => generateSrcset(output, opts))
                .join(", "),
        },
    };
    let bgBuffer = bgOutput.buffer
        ? bgOutput.buffer
        : fs.readFileSync(bgOutput.output);
    const $placeholder = {
        tag: "span",
        attrs: {
            class: "blurup__bg",
            style: [
                `background-image: url("data:image/${
                    bgOutput.format
                };base64,${bgBuffer.toString("base64")}")`,
                `padding-bottom: ${((1 / bgOutput.aspectRatio) * 100).toFixed(
                    4
                )}%`,
            ].join("; "),
        },
    };

    const $content = [$img, $placeholder || ""];
    return opts.linkify
        ? {
              tag: "a",
              attrs: {
                  target: "_blank",
                  rel: "noreferrer noopener",
                  href: opts.pathTransform(originalSrc),
                  class: "blurup__wrapper",
              },
              content: $content,
          }
        : {
              tag: "div",
              attrs: {
                  class: " blurup__wrapper",
              },
              content: $content,
          };
}

/** Generates the <source> for a given output */
function generateSrcset(output, opts) {
    const src = opts.pathTransform(output.relativeOutput.replace(/\\/g, "/"));
    return `${src} ${output.width}w`;
}

/** Checks whether we should apply to a posthtml node */
function shouldApply(node, opts) {
    return true;
}

/** Returns the posthtml node that should replace the given node
 * @param {object} node The posthtml node to replace
 * @param {import("../index.js").GlobalOptions} opts */
async function apply(node, opts = {}) {
    opts = {
        ...DEFAULT_OPTS,
        ...opts,
    };

    // exit early if we shouldn't do anything
    if (!opts.shouldApply(node, opts)) {
        return node;
    }

    const src = opts.extractSrcPath(node, opts);
    if (!src || src === "") {
        throw new Error(`Could not extract src from ${render(node, {})}`);
    }
    const srcPath = path.join(opts.root, src);

    const imgs = await fluid(srcPath, opts);
    const bg = await placeholder(srcPath, opts);

    const replacement = generateReplacement(node, imgs, src, bg[0], opts);
    return replacement;
}

module.exports = apply;
