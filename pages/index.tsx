import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Page, Project, Work } from "../components/homepage";
import Link from "../components/link";
import { H1, H2 } from "../components/typography";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Portfolio | Johan Fagerberg</title>
                <meta
                    name="description"
                    content="Frontend developer with an interest in developer workflows and digital privacy"
                />
            </Head>

            <Page hero>
                <H1>Hi</H1>
                <H1 plain>I'm Johan</H1>
            </Page>

            <Page style={{ fontSize: "24px" }}>
                <p>
                    I'm a frontend developer with an interest in security,
                    online privacy and automation. I enjoy implementing tools
                    that help improve the development experience.
                </p>
                <p>
                    I also spend some of my time maintaining open source
                    projects. I've been involved in projects such as{" "}
                    <Link href="https://simpleicons.org">Simple Icons</Link> and{" "}
                    <Link href="https://sweetalert2.github.io/">
                        SweetAlert2
                    </Link>
                    , amongst others. I also have a lot of smaller projects,
                    some of which you can see below.
                </p>
                <p>
                    When I have the time I go backpacking around Europe; so far
                    I have made my way around bits of{" "}
                    <Link href="/blog/travels/norway/">Norway</Link> and{" "}
                    <Link href="/blog/travels/scotland">Scotland</Link>. I also
                    sometimes write stuff on <Link href="/blog/">my blog</Link>.
                </p>
            </Page>

            <Page>
                <H2>Open Source Projects</H2>
                <Project
                    name="Yet Another Medium Zoom"
                    href="https://yamz.jfagerberg.me/"
                    tags={["TypeScript"]}
                    icon="yamz"
                >
                    A fully featured lightbox library inspired by Medium,
                    focusing on being modern, extensible and easy to use.
                </Project>
                <Project
                    name="SVGLint"
                    href="https://github.com/birjolaxew/svglint"
                    tags={["ES6", "Node.js"]}
                    icon="svglint"
                >
                    A pluggable linter for SVG files, developed while
                    maintaining the Simple Icons project.
                </Project>
                <Project
                    name="console-stream"
                    href="https://github.com/birjolaxew/console-stream"
                    tags={["TypeScript", "Node.js"]}
                    icon="consoleStream"
                >
                    Website for viewing the console of another tab, browser or
                    device. Implemented during a single-day hackathon.
                </Project>
                <Project
                    name="Brookshear Machine"
                    href="https://brookshear.jfagerberg.me/"
                    tags={["React", "Mobx", "ES6"]}
                    icon="brookshear"
                >
                    A Brookshear Machine emulator, useful for teaching the
                    basics of CPU instructions and low-level programming.
                </Project>
            </Page>

            <Page>
                <H2>Work History</H2>
                <Work
                    name="Frontend developer at CleanManager"
                    from="2015"
                    to="2019"
                >
                    <p>
                        As sole frontend developer I was initially tasked with
                        implementing new features and SPA's, and later
                        spearheaded the effort to modernize the entire frontend
                        codebase.
                    </p>
                    <p>
                        This included a complete rewrite and redesign of our
                        system and workflow from an old custom-built ES5
                        implementation to one built on React and ES6.
                    </p>
                    <p>
                        Eventually the team expanded with several new frontend
                        developers, and I transitioned into a more senior role
                        with responsibility for the frontend rewrite of our
                        calendar module.
                    </p>
                </Work>
            </Page>

            <Page>
                <H2>Education</H2>
                <Work
                    name={
                        (
                            <>
                                Bachelor's degree in Computer Science
                                <br />
                                from University of Southern Denmark
                            </>
                        ) as React.ReactNode
                    }
                    from="2021"
                    to="2021"
                >
                    <p>
                        During my studies I acted as instructor for a course on
                        functional programming.
                    </p>
                    <p>
                        Final bachelor project was on Ɛ-differential privacy, a
                        mathematical description of privacy-aware algorithms,
                        and ways to achieve it.
                        <br />
                        The project can be found{" "}
                        <Link href="https://github.com/birjolaxew/bachelor-project-privacy/releases/tag/v1.0">
                            on my GitHub.
                        </Link>
                    </p>
                </Work>
            </Page>

            <Page>
                <H2>Contact</H2>
                <p>
                    If you want to present a fun opportunity, have questions or
                    just want to have a chat, I'm always up to hearing from you.
                </p>
                <p>
                    You can catch me over on{" "}
                    <Link href="https://github.com/birjolaxew">GitHub</Link> or{" "}
                    <Link href="https://www.linkedin.com/in/johan-fagerberg-202527120/">
                        LinkedIn
                    </Link>
                    , or you can send me a good old-fashioned email at{" "}
                    <a href="mailto:johanringmann@gmail.com">
                        johanringmann@gmail.com
                    </a>
                    .
                </p>
                <div className={styles["contact-links"]}>
                    <Link href="https://github.com/birjolaxew" className="icon">
                        <svg role="img" viewBox="0 0 24 24">
                            <title>GitHub icon</title>
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/johan-fagerberg-202527120/"
                        className="icon"
                    >
                        <svg role="img" viewBox="0 0 24 24">
                            <title>LinkedIn icon</title>
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </Link>
                </div>
            </Page>
        </div>
    );
};

export default Home;
