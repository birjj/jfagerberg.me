import { AppProps } from "next/app";
import "../styles/global.css";
import "../styles/typography.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
