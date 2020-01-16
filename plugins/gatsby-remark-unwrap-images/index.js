const visit = require(`unist-util-visit`);
const remove = require(`unist-util-remove`);

// https://github.com/gatsbyjs/gatsby/issues/10341#issuecomment-466981127
module.exports = ({ markdownAST }) => {
    visit(markdownAST, `paragraph`, (node, index, parent) => {
        const hasOnlyImagesNodes = node.children.every(child => {
            return child.type === 'html' && child.url && child.alt;
        });

        if (!hasOnlyImagesNodes) {
            return;
        }

        remove(node, 'text');

        parent.children.splice(index, 1, ...node.children);

        return index;
    });
}
