const sharp = require("sharp");
const path = require("path");
const fs = require("fs-extra");

const imagemin = require("imagemin");
const imageminJPEG = require("imagemin-mozjpeg");
const imageminPNG = require("imagemin-pngquant");
const imageminWEBP = require("imagemin-webp");

if (process.env.NETLIFY) {
    sharp.concurrency(1);
}

/**
 * @typedef SharpOptions
 * @property {string} [outputDir] Directory to store the resized images in
 * @property {number} [pngCompression] 0-9, zlib compression
 * @property {number} [webpQuality] 1-100
 * @property {number} [jpegQuality] 1-100
 * @property {number} [quality] 1-100, used for both webp and jpeg if they aren't given
 * @property {boolean} [force] If true, perform operation even if image already exists
 * @property {boolean} [buffer] If true, return the buffer in the returned object
 * @property {boolean} [parallel=true] If true, compute all images in parallel
 */
const DEFAULT_OPTS = {
    outputDir: path.resolve(process.cwd(), "sharp-cache"),
    pngCompression: 9,
    quality: 80,
    parallel: !process.env.NETLIFY,
};

/** Resizes an image to multiple different sizes
 * @param {string} imgPath
 * @param {{width?:number,height?:number,format:"png"|"webp"|"jpeg"}[]} transforms
 * @param {SharpOptions} opts
 */
async function resizeImage(imgPath, transforms, opts = {}) {
    opts = {
        ...DEFAULT_OPTS,
        ...opts,
    };

    if (opts.root && !path.isAbsolute(opts.outputDir)) {
        const root = path.resolve(process.cwd(), opts.root);
        opts.outputDir = path.join(root, opts.outputDir);
    }

    // TODO: base output dir on source dir (so e.g. a/foo.jpg and b/foo.jpg can co-exist)
    await fs.ensureDir(opts.outputDir);

    const promises = [];
    for (let i = 0; i < transforms.length; ++i) {
        const transform = transforms[i];
        const prom = performResize(imgPath, transform, opts);
        if (!opts.parallel) {
            await prom;
        }
        promises.push(prom);
    }
    return Promise.all(promises);
}

async function performResize(imgPath, transform, opts) {
    const name = path
        .basename(imgPath)
        .replace(
            /\..+$/,
            [
                transform.width ? `-${transform.width}w` : "",
                transform.height ? `-${transform.height}h` : "",
                `.${transform.format}`,
            ].join("")
        );
    const outputPath = path.join(opts.outputDir, name);

    const outp = {
        output: outputPath,
        relativeOutput: path.relative(process.cwd(), outputPath),
        width: transform.width,
        height: transform.height,
        format: transform.format,
    };

    if (opts.root) {
        outp.relativeOutput =
            "/" +
            path.relative(path.resolve(process.cwd(), opts.root), outputPath);
    }

    // exit early if the file already exists
    if ((await fs.exists(outputPath)) && !opts.force) {
        return outp;
    }

    // ask sharp to resize
    const image = sharp(imgPath).resize(transform.width, transform.height);

    /** @type {Promise<void>} */
    let prom;
    switch (transform.format) {
        case "jpeg":
            prom = minifyJPEG(
                image.jpeg({
                    quality: opts.jpegQuality || opts.quality,
                }),
                outputPath,
                opts
            );
            break;
        case "png":
            prom = minifyPNG(
                image.png({
                    compressionLevel: opts.pngCompression,
                }),
                outputPath,
                opts
            );
            break;
        case "webp":
            prom = minifyWEBP(
                image.webp({
                    quality: opts.webpQuality || opts.quality,
                }),
                outputPath,
                opts
            );
            break;
        default:
            throw new Error(`Unrecognized format "${transform.format}"`);
    }

    const buffer = await prom;
    if (opts.buffer) {
        outp.buffer = buffer;
    }
    return outp;
}

/** Minifies a JPEG sharp pipe using imagemin
 * @param {sharp.Sharp} sharpPipe
 * @param {string} outputPath
 * @param {SharpOptions} opts */
function minifyJPEG(sharpPipe, outputPath, opts) {
    return sharpPipe
        .toBuffer()
        .then((buffer) =>
            imagemin.buffer(buffer, {
                plugins: [
                    imageminJPEG({
                        quality: opts.jpegQuality || opts.quality,
                    }),
                ],
            })
        )
        .then((buffer) => {
            fs.writeFile(outputPath, buffer);
            return buffer;
        });
}

/** Minifies a PNG sharp pipe using imagemin
 * @param {sharp.Sharp} sharpPipe
 * @param {string} outputPath
 * @param {SharpOptions} opts */
function minifyPNG(sharpPipe, outputPath, opts) {
    return sharpPipe
        .toBuffer()
        .then((buffer) =>
            imagemin.buffer(buffer, {
                plugins: [
                    imageminPNG({
                        strip: true,
                    }),
                ],
            })
        )
        .then((buffer) => {
            fs.writeFile(outputPath, buffer);
            return buffer;
        });
}

/** Minifies a WebP sharp pipe using imagemin
 * @param {sharp.Sharp} sharpPipe
 * @param {string} outputPath
 * @param {SharpOptions} opts */
function minifyWEBP(sharpPipe, outputPath, opts) {
    return sharpPipe
        .toBuffer()
        .then((buffer) =>
            imagemin.buffer(buffer, {
                plugins: [
                    imageminWEBP({
                        quality: opts.webpQuality || opts.quality,
                        metadata: "none",
                    }),
                ],
            })
        )
        .then((buffer) => {
            fs.writeFile(outputPath, buffer);
            return buffer;
        });
}

module.exports = {
    resizeImage,
};
