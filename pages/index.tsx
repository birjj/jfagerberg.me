import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";

import style from "../styles/index.module.css";

import ShaderCanvas from "../components/background/shader";
import DarkModeSwitcher from "../components/dark-mode-switcher";

export default function Home({
  allPostsData,
}: Awaited<ReturnType<typeof getStaticProps>>["props"]) {
  return (
    <Layout home>
      <ShaderCanvas />
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={style.page}>
        <h1>
          Hi<span className="dot">.</span>
          <br />
          I'm Johan<span className="dot">.</span>
        </h1>
        <p className={style.subheader}>
          Privacy advocate, JavaScript (et al.) engineer, and occasional
          backpacker.
          <br />
          You can read some of my musings on <Link href="/blog/">my blog.</Link>
        </p>
      </section>
      <section className={style.page}></section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
