import "../styles/globals.css";
import type { AppProps } from "next/app";

import Background from "../components/background";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Background>
            <Component {...pageProps} />
        </Background>
    );
}
export default MyApp;
