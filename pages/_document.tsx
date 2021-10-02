import Document, { Head, Html, Main, NextScript } from "next/document";

class CustomDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Questrial&family=Roboto&family=Merriweather&display=swap"
                        rel="stylesheet"
                    />

                    {/* favicon config created by realfavicongenerator */}
                    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                    <link rel="manifest" href="/site.webmanifest" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
export default CustomDocument;
