import { GetStaticPaths, GetStaticProps } from "next";
import { getAllPosts, getPostBySlug } from "../../lib/api";

type BlogProps = {
    slug: string;
} & React.ComponentPropsWithoutRef<"div">;
/** The actual component responsible for rendering the blog post */
const Blog = ({ slug, children }: BlogProps) => {
    return (
        <div>
            <p>Slug: {slug}</p>
            {children}
        </div>
    );
};
export default Blog;

/** Returns the props to pass to the Blog component given the slug from the URL */
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params as { slug: string };
    const data = await getPostBySlug(slug).catch((e) => null);
    if (!data) {
        return { notFound: true };
    }

    return {
        props: {
            slug: data.slug,
            children: data.content,
        },
    };
};

/** Returns which paths should be rendered statically (in our case these are also the only ones we want rendered dynamically) */
export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getAllPosts();
    return {
        paths: posts.map((post) => {
            // params should contain a key for each [param] in the static path (e.g. slug for [slug].tsx)
            return {
                params: {
                    slug: post.slug,
                },
            };
        }),
        // we're fine with giving 404 for non-build paths; our content is inherently tied to the build process, being fs-based
        fallback: false,
    };
};
