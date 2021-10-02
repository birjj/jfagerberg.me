import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import Link from "../components/link";
import styles from "../styles/Home.module.scss";

interface PageProps extends React.ComponentPropsWithoutRef<"section"> {
    hero?: boolean;
}
const Page = ({ hero = false, children, className, ...props }: PageProps) => {
    const cls = [
        styles.page,
        className || "",
        hero ? styles["page--hero"] : "",
    ].join(" ");
    return (
        <section {...props} className={cls}>
            {children}
        </section>
    );
};

const projectIconPaths = {
    yamz: () => (
        <>
            <path d="M18.897 11.863l.08 1.404 2.971-4.51v-.364h-2.443v.344c0 .022-.012.042-.017.064l1.47-.023a9.408 9.408 0 00-.67.94 85.416 85.416 0 01-1.391 2.145z" />
            <path d="M15.592 13.08c-.271.69-.449 1.14-.532 1.347h-.02c-.28-.625-.676-1.545-1.19-2.756l-1.421-3.278H10.83v.449l.752-.032-.103 2.487.451 1.147c.018-.685.041-1.486.069-2.413l.011-.459c.279.752.563 1.469.855 2.146.292.679.703 1.606 1.231 2.783l.585 1.306h.313L17.348 10c.025-.077.054-.143.078-.198.022-.056.041-.101.057-.136l.271 4.448c.006.069.01.171.01.304 0 .319-.048.555-.145.705-.099.15-.283.229-.555.234v.346h2.338v-.461l-.762.032a7.13 7.13 0 00-.021-.65l-.271-4.75-.013-.208c0-.341.058-.583.177-.726.122-.143.305-.21.556-.203v-.343h-1.544a101.35 101.35 0 01-1.025 2.484c-.341.8-.645 1.535-.907 2.202zM4.694 8.737v-.344H2v.459l.647-.022c.055.292.244.687.563 1.181l1.817 2.872-.011 1.19v.324c0 .319-.042.557-.129.709-.088.153-.28.236-.58.25v.346h2.454v-.461l-.867.041c.021-.18.031-.454.031-.823a17.586 17.586 0 01-.006-.804c.004-.384.009-.745.017-1.087l1.316-2.484c.256-.474.496-.81.715-1.013.22-.203.493-.314.819-.334v-.344h-2.13v.459l.824-.033c-.13.147-.298.411-.5.795l-.218.406c-.501.941-.874 1.65-1.118 2.13h-.02a29.445 29.445 0 01-1.159-1.764l-.325-.512c-.174-.27-.26-.498-.26-.678 0-.305.271-.459.814-.459zM21.201 14.835c-.296.287-.688.433-1.175.44l-.188.003v.425h2.1L22 13.561h-.354c0 .565-.149.991-.445 1.274zM12.398 15.283a1.985 1.985 0 00-.073-.536 4.938 4.938 0 00-.199-.612l-2.33-5.941h-.25l-2.15 5.859-.105.293c-.09.257-.17.449-.235.58.001.002.005.002.007.004.085.08.134.194.134.314v.459h1.139v-.461l-.816.043c.105-.252.193-.491.263-.722.138-.458.261-.829.365-1.116l2.715-.063.366.98c.068.195.105.358.105.491 0 .328-.206.496-.616.501v.346h2.39v-.461l-.71.042zm-4.095-2.285l.178-.512.563-1.587.438-1.18h.021l.471 1.285.742 1.995H8.303z" />
        </>
    ),
    svglint: () => (
        <>
            <path d="M12.553 9.086v1.594l1.129-1.128c0-.2.075-.398.226-.551a.78.78 0 1 1 .551 1.332l-1.126 1.128h1.594a.78.78 0 1 1 0 1.103h-1.594l1.126 1.128c.2 0 .4.076.55.229a.773.773 0 0 1 0 1.102.778.778 0 0 1-1.33-.551l-1.128-1.128v1.596a.78.78 0 1 1-1.104 0v-1.596l-1.126 1.128a.781.781 0 0 1-1.332.551.778.778 0 0 1 .551-1.331l1.129-1.128H9.076a.781.781 0 1 1 0-1.103h1.594l-1.129-1.128a.78.78 0 1 1 .781-.782l1.126 1.128V9.086a.779.779 0 0 1 .553-1.331.779.779 0 0 1 .552 1.331z" />
            <path d="M18.499 7.65l-5.904-3.404a1.187 1.187 0 0 0-1.192-.004L5.5 7.647a1.19 1.19 0 0 0-.603 1.028v6.84c.012.419.246.806.6 1.002l5.91 3.407a1.19 1.19 0 0 0 1.187 0l5.896-3.4c.368-.205.603-.593.611-1.032L19.1 8.653a1.187 1.187 0 0 0-.601-1.003zm-.422 8.129l-5.908 3.407a.335.335 0 0 1-.334 0l-5.912-3.407a.34.34 0 0 1-.174-.288V8.675c0-.12.071-.229.173-.288l5.906-3.407a.33.33 0 0 1 .333 0l5.913 3.408a.343.343 0 0 1 .176.288l.001 6.816a.334.334 0 0 1-.174.287z" />
        </>
    ),
    consoleStream: () => (
        <>
            <path d="M21 10.5a.5.5 0 0 1-.5-.5c0-2.481-2.019-4.5-4.5-4.5a.5.5 0 0 1 0-1c3.032 0 5.5 2.467 5.5 5.5a.5.5 0 0 1-.5.5z" />
            <path d="M19 10.5a.5.5 0 0 1-.5-.5c0-1.379-1.121-2.5-2.5-2.5a.5.5 0 0 1 0-1c1.93 0 3.5 1.57 3.5 3.5a.5.5 0 0 1-.5.5zM8 16.5a.5.5 0 0 1-.354-.853L8.293 15l-.646-.646a.5.5 0 0 1 .707-.707l1 1a.5.5 0 0 1 0 .707l-1 1A.502.502 0 0 1 8 16.5z" />
            <path d="M16 9H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1zm-1 9H6v-7h10v7h-1z" />
        </>
    ),
    brookshear: () => (
        <>
            <path d="M14 5H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zm0 9H6V6h8v8z" />
            <path d="M8 8h4v4H8zM8.5 0A1.5 1.5 0 0 0 8 2.9V5h1V2.9A1.5 1.5 0 0 0 8.5 0zm0 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zM14.5 1c-.65 0-1.2.42-1.4 1H12a1 1 0 0 0-1 1v2h1V3h1.1a1.5 1.5 0 1 0 1.4-2zm0 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zM20 8.5a1.5 1.5 0 0 0-2.9-.5H15v1h2.1a1.5 1.5 0 0 0 2.9-.5zm-2 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0zM19 14.5c0-.65-.42-1.2-1-1.4V12a1 1 0 0 0-1-1h-2v1h2v1.1a1.5 1.5 0 1 0 2 1.4zm-2 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0zM11.5 20a1.5 1.5 0 0 0 .5-2.9V15h-1v2.1a1.5 1.5 0 0 0 .5 2.9zm0-2a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zM5.5 19c.65 0 1.2-.42 1.4-1H8a1 1 0 0 0 1-1v-2H8v2H6.9a1.5 1.5 0 1 0-1.4 2zm0-2a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zM0 11.5a1.5 1.5 0 0 0 2.9.5H5v-1H2.9a1.5 1.5 0 0 0-2.9.5zm2 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM1 5.5c0 .65.42 1.2 1 1.4V8a1 1 0 0 0 1 1h2V8H3V6.9a1.5 1.5 0 1 0-2-1.4zm2 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
        </>
    ),
};
interface ProjectProps extends React.ComponentPropsWithoutRef<"div"> {
    icon: keyof typeof projectIconPaths;
    href: string;
    name: string;
    tags: string[];
}
const Project = ({ icon, href, name, tags, children }: ProjectProps) => {
    const Icon = projectIconPaths[icon];
    return (
        <div className={styles.project}>
            <svg
                className={styles.project__icon}
                viewBox="0 0 24 24"
                role="img"
            >
                <Icon />
            </svg>
            <div className={styles.project__text}>
                <h3>
                    <Link href={href}>{name}</Link>
                    <span className={styles.project__tags}>
                        {tags.join(" ⋅ ")}
                    </span>
                </h3>
                <p>{children}</p>
            </div>
        </div>
    );
};

interface WorkProps extends React.ComponentPropsWithoutRef<"div"> {
    from: string;
    to: string;
    name: React.ReactNode;
}
const Work = ({ from, to, name, children }: WorkProps) => {
    // simplify "2021 - 2021" to "2021"
    const duration = from === to ? from : `${from} - ${to}`;

    return (
        <div className={styles.work}>
            <div className={styles.work__duration}>{duration}</div>
            <div className={styles.work__text}>
                <h3>{name}</h3>
                {children}
            </div>
        </div>
    );
};

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
                <h1>
                    Hi<span className="highlight">.</span>
                </h1>
                <h1>I'm Johan</h1>
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
                <h2>
                    Open Source Projects<span className="highlight">.</span>
                </h2>
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
                <h2>
                    Work History<span className="highlight">.</span>
                </h2>
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
                <h2>
                    Education<span className="highlight">.</span>
                </h2>
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
                <h2>
                    Contact<span className="highlight">.</span>
                </h2>
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
