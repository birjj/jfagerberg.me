import React from "react";
import { graphql, Link } from "gatsby";
import styled from "styled-components";
import rehypeReact from "rehype-react";
import yamz from "yet-another-medium-zoom";

import Icon from "../icon";
import SEO from "../seo";
import Layout from "../layout";
import { Picture, PictureGrid } from "./pictures";
import WrapperComponent from "./wrapper";

const Wrapper = styled(WrapperComponent)`
    width: calc(
        ${props => props.theme.width} + 2 * ${props => props.theme.gutter}
    );
    max-width: 100%;
    font-size: 18px;
    font-family: "Merriweather", serif;
    line-height: 1.8em;
    letter-spacing: 0.5px;

    > p {
        width: ${props => props.theme.width};
        margin: 0 auto 2em;
    }

    .gatsby-image-wrapper,
    .gatsby-resp-image-link,
    video {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    }

    video {
        margin: 0 auto 2em;
    }
`;

interface NavProps {
    className?: string;
    withoutBlog?: boolean;
}
const NavComponent = ({ className, withoutBlog = false }: NavProps) => {
    return (
        <nav className={className}>
            <Link to="/">
                <Icon name="arrow-left" />
                Home
            </Link>
            {withoutBlog ? null : <Link to="/blog/">Blog</Link>}
        </nav>
    );
};
const Nav = styled(NavComponent)`
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: ${props => props.theme.width};
    margin: 0 auto 4em;

    svg {
        width: 1em;
        height: 1em;
        margin-right: 0.5ch;
        font-size: 18px;
    }

    a {
        display: inline-flex;
        align-items: center;

        color: #fff;
        font-weight: bold;
        text-decoration: none;
        font-family: "Questrial", sans-serif;
        font-size: 16px;

        opacity: 0.5;
        &:hover {
            opacity: 1;
        }
        &:active {
            transform: translateY(1px);
        }

        &::after {
            display: none;
        }
    }
`;

const Title = styled.section`
    font-size: inherit;
    font-family: "Questrial", sans-serif;
    text-align: center;
    margin: 0 auto 2em;
    max-width: ${props => props.theme.width};

    > h1 {
        font-size: 40px;
        line-height: 1.2em;
        margin-top: 0;
    }

    > small {
        font-size: inherit;
        font-weight: bold;
        opacity: 0.5;
        float: right;
    }

    &::after {
        content: "";
        display: block;
        clear: both;
    }

    & ~ & {
        margin-top: 6em;
    }
`;

// create a rehype renderer
const renderAst = new rehypeReact({
    createElement: React.createElement,
    Fragment: React.Fragment,
    components: {
        picture: Picture,
        "picture-grid": PictureGrid,
        "centered-title": Title,
    },
}).Compiler;

// wrap the rehype renderer in a function that replaces the outermost div with a Fragment
const fragmentRender = (tree: React.ReactNode) => {
    const reply: React.ReactElement<{ children?: React.ReactNode }> = renderAst(
        tree
    );
    return reply.type === "div" ? <>{reply.props.children}</> : reply;
};

interface TemplateProps {
    data: {
        markdownRemark: {
            htmlAst: string;
            frontmatter: {
                title: string;
                date: string;
                keywords: string[];
                settings: {
                    noTitle: boolean;
                };
            };
        };
    };
}
export default ({ data }: TemplateProps) => {
    const post = data.markdownRemark;
    return (
        <Layout>
            <SEO
                title={post.frontmatter.title}
                keywords={[
                    `Johan Fagerberg`,
                    `frontend developer`,
                    `react developer`,
                    ...post.frontmatter.keywords,
                ]}
            />
            <Wrapper>
                <Nav />
                {post.frontmatter.settings &&
                post.frontmatter.settings.noTitle ? null : (
                    <Title>
                        <h1>{post.frontmatter.title}</h1>
                        <small>{post.frontmatter.date}</small>
                    </Title>
                )}
                {fragmentRender(post.htmlAst)}
            </Wrapper>
        </Layout>
    );
};

export const query = graphql`
    query($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            htmlAst
            frontmatter {
                title
                date(formatString: "MMMM Do, YYYY")
                keywords
                settings {
                    noTitle
                }
            }
        }
    }
`;
