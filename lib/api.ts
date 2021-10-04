import { readdir, readFile } from "fs/promises";
import { join } from "path";

const BLOG_DIRECTORY = join(process.cwd(), "blog");
const REG_EXT = /\.mdx?$/;

async function getBlogSlugs(dir = BLOG_DIRECTORY) {
    const slugs: string[] = [];
    const files = await readdir(dir, { withFileTypes: true });
    // recurse into lower directories
    const promises = files.map(async (file) => {
        if (file.isFile() && REG_EXT.test(file.name)) {
            slugs.push(file.name);
        } else if (file.isDirectory()) {
            const innerDir = join(dir, file.name);
            const innerSlugs = (await getBlogSlugs(innerDir)).map((slug) =>
                join(file.name, slug)
            );
            slugs.push(...innerSlugs);
        }
    });
    await Promise.all(promises);

    return slugs;
}

/** Get data for a specific slug
 * @param slug May or may not end with .mdx
 */
export async function getPostBySlug(slug: string) {
    const cleanSlug = slug.replace(REG_EXT, "");
    const path = join(BLOG_DIRECTORY, `${cleanSlug}.mdx`);
    const content = await readFile(path);
    return {
        slug: cleanSlug,
        content: content.toString(),
    };
}

/** Returns all posts from the blog, sorted by date */
export async function getAllPosts() {
    const slugs = await getBlogSlugs();
    const posts = Promise.all(slugs.map((slug) => getPostBySlug(slug)));
    // TODO: sort by date
    return posts;
}
