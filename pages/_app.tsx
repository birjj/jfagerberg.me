import type { AppProps } from "next/app";
import { MDXProvider } from "@mdx-js/react";

import Image, { ImageProps } from "next/image";
import Background from "../components/background";
import { Header } from "../components/blog/typography";
import { H2, H3 } from "../components/typography";
import Link from "../components/link";

import "../styles/globals.scss";

// the components that'll be used in MDX pages (currently only blog posts)
const blogComponents = {
    h1: Header,
    h2: H2,
    h3: H3,
    img: (props: ImageProps) => {
        return (
            <Image
                alt={props.alt} /* ESLint workaround */
                placeholder="blur"
                layout="responsive"
                {...props}
            />
        );
    },
    a: Link,
};

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <MDXProvider components={blogComponents}>
            <Background>
                <Component {...pageProps} />
            </Background>
        </MDXProvider>
    );
}
export default MyApp;
