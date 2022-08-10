import Head from "next/head";
import Image from "next/image";
import styles from "./layout.module.css";
import Link from "next/link";
import PageLoader from "./common/page-loader";
import React from "react";
import DarkModeSwitcher from "./common/dark-mode-switcher";

const name = "Johan Fagerberg";
export const siteTitle = "Johan Fagerberg";

export default function Layout({
  children,
  home = false,
  blog = false,
}: React.PropsWithChildren<{ home?: boolean; blog?: boolean }>) {
  return (
    <div
      className={[
        styles.container,
        home ? styles["container--home"] : "",
        blog ? styles["container--blog"] : "",
      ].join(" ")}
    >
      <PageLoader />
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://jfagerberg.me/favicon-32x32.png`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />

        <link rel="prefetch" href="/images/topography_dark.svg" as="image" />
        <link rel="prefetch" href="/images/topography_light.svg" as="image" />
      </Head>
      <DarkModeSwitcher />
      <main>{children}</main>
    </div>
  );
}
