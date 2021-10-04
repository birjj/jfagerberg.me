import type { AppProps } from "next/app";
import { MDXProvider } from "@mdx-js/react";

import Background from "../components/background";
import { H1, H2, H3 } from "../components/typography";

import "../styles/globals.scss";

// the components that'll be used in MDX pages (currently only blog posts)
const blogComponents = {
    h1: H1,
    h2: H2,
    h3: H3,
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
