// @ts-check
const sharp = require("sharp");
const fs = require("fs-extra");
const { resizeImage } = require("./sharp");

/**
 * Resizes an image to our placeholder size (usually width=20)
 * @param {string} path Absolute path to the image
 * @param {import("../index.js").GlobalOptions} opts
 */
async function placeholder(path, opts = {}) {
    const { width, height, format } = await getImageInfo(path);
    const aspectRatio = width / height;

    return performResize(
        path,
        [
            {
                width: 20,
                format,
            },
        ],
        {
            ...opts,
            buffer: true,
        },
        "width",
        aspectRatio
    );
}

/**
 * @typedef FluidOptions
 * @property {number} [maxWidth]
 * @property {number} [maxHeight]
 */

/** Calculates the sizes of a fluid image, given its fixed dimension and the image opts
 * @param {number} fixed The value of the fixed dimension
 * @param {FluidOptions} opts */
function fluidSizes(fixed, opts) {
    return [
        fixed,
        fixed / 4,
        fixed / 2,
        fixed * 1.5,
        fixed * 2,
        fixed * 3,
        fixed * 4,
        fixed * 5,
        fixed * 6,
    ];
}

/**
 * Resizes an image using fluid sizing
 * Largely identical to the function from gatsby-plugin-sharp
 * @param {string} path Absolute path to the image
 * @param {import("../index.js").GlobalOptions} opts
 */
async function fluid(path, opts = {}) {
    const { width, height, format } = await getImageInfo(path);
    const aspectRatio = width / height;

    // calculate the sizes based off the options
    const fixedDimension = opts.maxWidth === undefined ? "height" : "width";
    const fixedLimit = fixedDimension === "width" ? width : height;
    if (!opts[fixedDimension === "width" ? "maxWidth" : "maxHeight"]) {
        throw new Error(
            `Either maxWidth or maxHeight must be set for fluid sizing to work, got ${opts.maxWidth} and ${opts.maxHeight} respectively`
        );
    }

    // only use sizes that aren't greater than the original image size, and ensure we include the original image size
    const sizes = fluidSizes(
        fixedDimension === "width" ? opts.maxWidth : opts.maxHeight,
        opts
    ).filter((size) => size < fixedLimit);
    sizes.push(fixedLimit);
    sizes.sort((a, b) => b - a); // sort in descending order

    return performResize(
        path,
        sizes.map((size) => ({ [fixedDimension]: size, format: format })),
        opts,
        fixedDimension,
        aspectRatio
    );
}

/** Gets the size of an image, used by our other functions
 * @param {string} path Absolute path to the image
 */
async function getImageInfo(path) {
    if (!fs.existsSync(path)) {
        throw new Error(`Cannot find file ${path}`);
    }

    const { width, height, format } = await sharp(path).metadata();
    if (format !== "jpeg" && format !== "png" && format !== "webp") {
        throw new Error(`Unknown image format "${format}"`);
    }

    /** @type {{width:number,height:number,format:"jpeg"|"png"|"webp"}} */
    const outp = { width, height, format };
    return outp;
}

/** Performs the resizing of the images
 * @param {string} path
 * @param {{width?:number,height?:number,format:"jpeg"|"png"|"webp"}[]} formats
 * @param {import("../index.js").GlobalOptions} opts
 * @param {"width"|"height"} fixedDimension
 * @param {number} aspectRatio
 */
async function performResize(path, formats, opts, fixedDimension, aspectRatio) {
    // transform our images
    const images = await resizeImage(
        path,
        formats.map((format) => {
            return {
                width: format.width ? Math.round(format.width) : undefined,
                height: format.height ? Math.round(format.height) : undefined,
                format: format.format,
            };
        }),
        opts
    );

    const nonFixedDimension = fixedDimension === "width" ? "height" : "width";
    return images.map((img) => {
        const data = {
            ...img,
            aspectRatio: aspectRatio,
        };
        if (!data[nonFixedDimension] && data[fixedDimension]) {
            data[nonFixedDimension] = Math.round(
                fixedDimension === "width"
                    ? data[fixedDimension] / aspectRatio
                    : data[fixedDimension] * aspectRatio
            );
        }
        return data;
    });
}

module.exports = {
    fluid,
    placeholder,
};
