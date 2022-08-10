import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";

import style from "../styles/index.module.css";

import ShaderCanvas from "../components/landing-page/background/shader";
import Project from "../components/landing-page/project";
import {
  BrookshearIcon,
  GithubIcon,
  LinkedInIcon,
  ManateeInspectorIcon,
  SVGLintIcon,
  YAMZIcon,
} from "../components/common/icons";
import WorkHistory from "../components/landing-page/work-history";

export default function Home({
  allPostsData,
}: Awaited<ReturnType<typeof getStaticProps>>["props"]) {
  return (
    <Layout home>
      <ShaderCanvas />
      <Head>
        <title>Portfolio | {siteTitle}</title>
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
      <section className={style.page}>
        <h2>
          Open Source Projects<span className="dot">.</span>
        </h2>
        <p>
          I've been a maintainer and contributor to several open-source
          projects, such as <a href="https://simpleicons.org/">Simple Icons</a>{" "}
          and <a href="https://sweetalert2.github.io/">SweetAlert2</a>.<br />I
          also have a lot of smaller projects, including:
        </p>
        <Project
          icon={<ManateeInspectorIcon />}
          title="Manatee Inspector"
          url="https://github.com/birjj/manatee-inspector"
        >
          A custom dev tool implementation for the{" "}
          <a
            href="https://sirenia.eu/products/rpa/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Manatee
          </a>{" "}
          RPA application. Provides vastly improved DX compared to the built-in
          dev&nbsp;tools.
        </Project>
        <Project
          icon={<YAMZIcon />}
          title="Yet Another Medium Zoom"
          url="https://yamz.jfagerberg.me/"
        >
          A fully featured lightbox library inspired by Medium, focusing on
          being modern, extensible and easy to use.
        </Project>
        <Project
          icon={<SVGLintIcon />}
          title="SVGLint"
          url="https://github.com/birjj/svglint"
        >
          A pluggable linter for SVG files, developed while maintaining the
          Simple Icons project.
        </Project>
        <Project
          icon={<BrookshearIcon />}
          title="Brookshear Machine"
          url="https://brookshear.jfagerberg.me/"
        >
          A Brookshear Machine emulator, useful for teaching the basics of CPU
          instructions and low-level programming.
        </Project>
      </section>

      <section className={style.page}>
        <h2>
          Work History<span className="dot">.</span>
        </h2>
        <WorkHistory
          date="2022 - now"
          title="RPA developer at Odense University Hospital"
        >
          <p>
            Responsible for automatization of work processes across the hospital
            using the
            <a href="https://sirenia.eu/products/rpa/" target="_blank">
              Manatee
            </a>
            RPA application. Had ownership of the entire process, from customer
            communication to final implementation.
          </p>
          <p>
            As the RPA team was newly formed when I joined, and I was the most
            experienced developers, I became responsible for the development of
            work processes, developer tools and documentation in order to
            improve the DX and productivity of the team.
          </p>
          <p>
            This evolved into being responsible for multiple internal department
            projects, handling design, server management and development.
          </p>
        </WorkHistory>

        <WorkHistory
          date="2015 - 2019"
          title="Frontend developer at CleanManager"
        >
          <p>
            As sole frontend developer I was initially tasked with implementing
            new features and SPA's, and later spearheaded the effort to
            modernize the entire frontend codebase.
          </p>
          <p>
            This included a complete rewrite and redesign of our system and
            workflow from an old custom-built ES5 implementation to one built on
            React and ES6.
          </p>
          <p>
            Eventually the team expanded with several new frontend developers,
            and I transitioned into a more senior role with responsibility for
            the frontend rewrite of our calendar module.
          </p>
        </WorkHistory>
      </section>

      <section className={style.page}>
        <h2>
          Education<span className="dot">.</span>
        </h2>

        <WorkHistory
          date="2021"
          title="Bachelor's degree in Computer Science
from University of Southern Denmark"
        >
          <p>
            During my studies I acted as instructor for a course on functional
            programming.
          </p>
          <p>
            Final bachelor project was on Ɛ-differential privacy, a mathematical
            description of privacy-aware algorithms, and ways to achieve it.
            <br />
            The project can be found{" "}
            <a
              href="https://github.com/birjj/bachelor-project-privacy/releases/tag/v1.0"
              target="_blank"
            >
              on my GitHub.
            </a>
          </p>
        </WorkHistory>
      </section>

      <section className={style.page}>
        <h2>
          Contact<span className="dot">.</span>
        </h2>
        <p>
          If you want to present a fun opportunity, have questions or just want
          to have a chat, I'm always up to hearing from you.
        </p>
        <p>
          You can catch me over on{" "}
          <a href="https://github.com/birjj" target="_blank">
            GitHub
          </a>{" "}
          or{" "}
          <a
            href="https://www.linkedin.com/in/johan-fagerberg-202527120/"
            target="_blank"
          >
            LinkedIn
          </a>
          , or you can send me a good old-fashioned email at{" "}
          <a href="mailto:johanringmann@gmail.com">johanringmann@gmail.com</a>.
        </p>
        <div className={style.contactLinks}>
          <a href="https://github.com/birjj" target="_blank">
            <GithubIcon />
          </a>
          <a
            href="https://www.linkedin.com/in/johan-fagerberg-202527120/"
            target="_blank"
          >
            <LinkedInIcon />
          </a>
        </div>
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
