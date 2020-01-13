/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const { createFilePath } = require("gatsby-source-filesystem");
const path = require("path");

const nodeToSlug = ({ node, getNode }) => {
    let slug = createFilePath({ node, getNode, basePath: "pages" });
    // remove the "index" from paths - some posts are named after the folder they are in
    if (slug.endsWith("/index/")) {
        slug = slug.replace(/\/index\/$/, "/");
    }
    return slug;
};

// add `slug` field to all markdown pages
exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;
    if (node.internal.type === "MarkdownRemark") {
        const slug = nodeToSlug({ node, getNode });
        createNodeField({
            node,
            name: "slug",
            value: slug,
        });
    }
};

/*
// create pages for each markdown page
const typeToTemplate = {
    project: "project.js",
    blog: "blog-post.js",
};
exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions;
    return graphql(`
        { allMarkdownRemark { edges { node {
            fields {
                slug
            }
            frontmatter {
                type
            }
        } } } }
    `).then(result => {
        result.data.allMarkdownRemark.edges.forEach(({ node }) => {
            console.log("[gatsby-node.js] Creating page", node.fields.slug);
            if (typeToTemplate[node.frontmatter.type]) {
                createPage({
                    path: node.fields.slug,
                    component: path.resolve(`./src/templates/${typeToTemplate[node.frontmatter.type]}`),
                    context: {
                        slug: node.fields.slug,
                    }
                });
            } else {
                console.warn("Unknown template", node.frontmatter.type);
            }
        });
    });
}
*/
