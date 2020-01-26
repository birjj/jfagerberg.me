import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { graphql, Link } from "gatsby";
import styled from "styled-components";
import rehypeReact from "rehype-react";
import "katex/dist/katex.min.css";

import Icon from "../icon";
import SEO from "../seo";
import Layout from "../layout";
import { Picture, PictureGrid } from "./pictures";
import WrapperComponent from "./wrapper";

if (typeof btoa === "undefined") {
    window.btoa = (data: string) =>
        Buffer.from(data, "binary").toString("base64");
}

const WidthWrapper = styled(
    ({ children, ...props }: { children?: React.ReactNode }) => (
        <div {...props}>{children}</div>
    )
)``;

const Wrapper = styled(WrapperComponent)`
    width: calc(
        ${props => props.theme.width} + 2 * ${props => props.theme.gutter}
    );
    max-width: 100%;
    font-size: 18px;
    font-family: "Merriweather", serif;
    line-height: 1.8em;
    letter-spacing: 0.5px;

    > p,
    > ${WidthWrapper} {
        width: ${props => props.theme.width};
        margin: 0 auto 2em;
    }
    > p + .katex-display {
        margin-top: 0;
    }

    h2 {
        font-size: 1.75em;
        margin-top: 1.5em;
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

        &,
        &:hover {
            background-image: none;
        }

        opacity: 0.5;
        &:hover {
            opacity: 1;
        }
        &:active {
            transform: translateY(1px);
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

const Highlight = styled.span`
    color: #0eb1d2;
`;

// create a rehype renderer
const renderAst = new rehypeReact({
    createElement: React.createElement,
    components: {
        picture: Picture,
        "picture-grid": PictureGrid,
        "centered-title": Title,
        h2: ({ children, ...props }: { children?: React.ReactNode }) => (
            <WidthWrapper>
                <h2 {...props}>
                    {children}
                    <Highlight>.</Highlight>
                </h2>
            </WidthWrapper>
        ),
    },
}).Compiler;

// wrap the rehype renderer in a function that replaces the outermost div with a Fragment
const fragmentRender = (tree: React.ReactNode) => {
    const reply: React.ReactElement<{ children?: React.ReactNode }> = renderAst(
        tree
    );
    return reply.type === "div" ? (
        <>{customizeChildren(reply.props.children)}</>
    ) : (
        reply
    );
};

// singular images collapse on themselves in Firefox if they are the child of a flex column
const ImgWrapper = styled.div`
    margin-bottom: 2em;
`;
const customizeChildren = (children: React.ReactNode) =>
    React.Children.map(children, (child: React.ReactNode) => {
        if (!(child instanceof Object)) {
            return child;
        }
        // wrap images
        if (
            "props" in child &&
            child.props.className &&
            child.props.className.indexOf("gatsby-resp-image-wrapper") > -1
        ) {
            return <ImgWrapper>{child}</ImgWrapper>;
        }
        // convert SVG to images
        if ("type" in child && child.type === "svg") {
            const markup = renderToStaticMarkup(child);
            const dataUri = `data:image/svg+xml;base64,${btoa(markup)}`;
            console.log(dataUri);
            return <img src={dataUri} />;
        }
        return child;
    });

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
                <Nav withoutBlog />
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
