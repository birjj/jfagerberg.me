import React from "react";
import { graphql, Link } from "gatsby";
import styled from "styled-components";

import SEO from "../seo";
import Layout from "../layout";

import Icon from "../icon";
import Project from "../index/project";
import Work from "../index/work";
import Page from "../page";

const ContactLinksWrapper = styled.div`
    text-align: center;
    margin-top: 1em;

    a {
        margin-right: 1em;
        &:last-child {
            margin-right: 0;
        }
    }

    svg {
        width: 48px;
        height: 48px;
        fill: ${props => props.theme.color};
    }
`;

const Title = styled.h1`
    font-size: 15vh;
    @media (min-height: 728px) {
        font-size: 5em;
    }
    @media (max-height: 512px), (max-width: 712px) {
        font-size: 3.5em;
    }
`;

const Highlight = styled.span`
    color: #0eb1d2;
`;

interface IndexProps {
    data: {
        allMarkdownRemark: {
            edges: {
                node: {
                    id: string;
                    frontmatter: {
                        title: string;
                        technologies: string[];
                        href: string;
                        icon: Parameters<typeof Icon>[0]["name"];
                        description: string;
                    };
                };
            }[];
        };
    };
}
export default ({ data }: IndexProps) => (
    <Layout leftAligned>
        <SEO
            title="Portfolio"
            keywords={[
                `Johan Fagerberg`,
                `frontend developer`,
                `react developer`,
            ]}
        />
        <Page centered full>
            <Title>
                Hi<Highlight>.</Highlight>
            </Title>
            <Title>I'm Johan</Title>
        </Page>
        <Page>
            <div style={{ fontSize: "24px" }}>
                <p>
                    I'm a frontend developer with a primary focus on modern
                    JavaScript, creating fun and interactive applications using
                    React and ES6.
                </p>
                <p>
                    I spend a bit of my time maintaining open source projects.
                    Most well known is{" "}
                    <a
                        href="http://simpleicons.org/"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Simple Icons
                    </a>{" "}
                    and the Chrome extension{" "}
                    <a
                        href="https://chrome.google.com/webstore/detail/loungedestroyer/ghahcnmfjfckcedfajbhekgknjdplfcl"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Lounge Destroyer
                    </a>
                    . You can also see some of my smaller projects below.
                </p>
                <p>
                    When I have the time I go backpacking around Europe; so far
                    I have made my way around bits of{" "}
                    <Link to="/travels/norway/">Norway</Link> and{" "}
                    <Link to="/travels/scotland/">Scotland</Link>.
                </p>
            </div>
        </Page>
        <Page>
            <h2>
                Open Source Projects<Highlight>.</Highlight>
            </h2>
            {data.allMarkdownRemark.edges.map(({ node }) => (
                <Project
                    title={node.frontmatter.title}
                    technologies={node.frontmatter.technologies}
                    href={node.frontmatter.href}
                    readMoreHref={
                        undefined /*node.html ? node.fields.slug : null*/
                    }
                    icon={<Icon name={node.frontmatter.icon} />}
                    key={node.id}
                >
                    {node.frontmatter.description}
                </Project>
            ))}
        </Page>
        <Page>
            <h2>
                Work History<Highlight>.</Highlight>
            </h2>
            <Work
                title="Frontend developer at CleanManager"
                duration="2015 - 2019"
            >
                <p>
                    As sole frontend developer I was initially tasked with
                    implementing new features and SPA's, and later spearheaded
                    the effort to modernize the entire frontend codebase.
                </p>
                <p>
                    This included a complete rewrite and redesign of our system
                    and workflow from an old custom-built ES5 implementation to
                    one built on React and ES6.
                </p>
                <p>
                    Eventually the team expanded with several new frontend
                    developers, and I transitioned into a more senior role with
                    responsibility for the frontend rewrite of our calendar
                    module.
                </p>
            </Work>
        </Page>
        <Page>
            <h2>
                Education<Highlight>.</Highlight>
            </h2>
            <Work
                title="Computer Science at University of Southern Denmark"
                duration="2017 - 2019"
            />
        </Page>
        <Page>
            <h2>
                Contact<Highlight>.</Highlight>
            </h2>
            <p>
                If you want to present a fun opportunity, have questions or just
                want to have a chat, I'm always up to hearing from you.
            </p>
            <p>
                You can catch me over on{" "}
                <a
                    href="https://github.com/birjolaxew"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>{" "}
                or{" "}
                <a
                    href="https://www.linkedin.com/in/johan-fagerberg-202527120/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    LinkedIn
                </a>
                , or you can send me a good old-fashioned email at{" "}
                <a href="mailto:johanringmann@gmail.com">
                    johanringmann@gmail.com
                </a>
                .
            </p>
            <ContactLinksWrapper>
                <a
                    href="https://github.com/birjolaxew"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon"
                >
                    <Icon name="github" />
                </a>
                <a
                    href="https://www.linkedin.com/in/johan-fagerberg-202527120/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon"
                >
                    <Icon name="linkedin" />
                </a>
            </ContactLinksWrapper>
        </Page>
    </Layout>
);

export const query = graphql`
    query {
        allMarkdownRemark(
            filter: { frontmatter: { type: { eq: "project" } } }
            sort: { fields: [frontmatter___date], order: DESC }
        ) {
            edges {
                node {
                    id
                    html
                    fields {
                        slug
                    }
                    frontmatter {
                        title
                        description
                        href
                        technologies
                        icon
                        date
                    }
                }
            }
        }
    }
`;
