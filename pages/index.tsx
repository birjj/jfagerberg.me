import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";

import ShaderCanvas from "../components/background/shader";

export default function Home({
  allPostsData,
}: Awaited<ReturnType<typeof getStaticProps>>["props"]) {
  return (
    <Layout home>
      <ShaderCanvas />
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <h1>
          Hi.
          <br />
          I'm Johan.
        </h1>
        <p className="subheader">
          Privacy advocate, JavaScript (et al.) engineer, and occasional
          backpacker.
        </p>
        <p>
          You can read some of my musings on <Link href="/blog/">my blog</Link>
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
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
