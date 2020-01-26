import React from "react";
import { Link, graphql } from "gatsby";
import styled from "styled-components";

import Layout from "../layout";
import SEO from "../seo";
import Wrapper from "../blog/wrapper";
import { Nav, Title } from "../blog/template";

const Date = styled.span`
    margin: 0 2ch;
    font-size: 16px;
    color: #aaa;
    vertical-align: middle;
    padding-bottom: 0.2em;
`;
const PostLink = styled(({ node, ...props }: { node: BlogNode }) => {
    return (
        <div {...props}>
            <h3>
                <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
                <Date>{node.frontmatter.date}</Date>
            </h3>
            <p>{node.frontmatter.description}</p>
        </div>
    );
})`
    padding: 2em 0 1em;
    display: flex;
    flex-direction: column;
    max-width: ${props => props.theme.width};

    @media (max-width: 600px) {
        padding: 1em 0;
    }

    p {
        margin: 0;
    }
`;

interface BlogNode {
    id: string;
    fields: {
        slug: string;
    };
    frontmatter: {
        title: string;
        date: string;
        tags?: string[];
        description: string;
        settings: {
            noTitle: boolean;
        };
    };
}
interface BlogProps {
    data: {
        allMarkdownRemark: {
            edges: { node: BlogNode }[];
        };
    };
}

const Blog = ({ data }: BlogProps) => {
    const Posts = data.allMarkdownRemark.edges
        .filter(edge => !!edge.node.frontmatter.date)
        .map(edge => <PostLink key={edge.node.fields.slug} node={edge.node} />);
    return (
        <Layout>
            <SEO
                title="Blog"
                keywords={[
                    `Johan Fagerberg`,
                    `frontend developer`,
                    `react developer`,
                ]}
            />
            <Wrapper>
                <Nav withoutBlog />
                <Title>
                    <h1>Blog</h1>
                </Title>
                {Posts}
            </Wrapper>
        </Layout>
    );
};

export default Blog;

export const pageQuery = graphql`
    query {
        allMarkdownRemark(
            filter: { frontmatter: { type: { ne: "project" } } }
            sort: { order: DESC, fields: [frontmatter___date] }
        ) {
            edges {
                node {
                    id
                    fields {
                        slug
                    }
                    frontmatter {
                        title
                        type
                        date(formatString: "MMMM Do, YYYY")
                        description
                        tags
                        settings {
                            noTitle
                        }
                    }
                }
            }
        }
    }
`;
