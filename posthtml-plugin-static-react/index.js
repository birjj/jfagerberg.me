/**
 * @fileoverview Implements a posthtml plugin for replacing custom elements with static React components
 * Largely based on posthtml-static-react by github.com/phloe, with some changes
 * This implementation supports current React version, dependency tracking,
 *   HMR, and returns the compiled element as AST instead of as string
 */

const react = require("react");
const reactIs = require("react-is");
const reactServer = require("react-dom/server");
const { parser } = require("posthtml-parser");
const matchHelper = require("posthtml-match-helper");

/** Lookup table for converting HTML attributes to React properties */
const attrToProp = {
    class: "className",
    for: "htmlFor",
};

/** Converts a node to a React component, recursively converting child elements too */
function toReact(node, components, tree) {
    const tag = node.tag;
    const attrs = node.attrs;
    const element =
        tag in components
            ? components[tag]
            : reactIs.isValidElementType(tag)
            ? tag
            : "div";
    const props = { key: Math.random().toString(32).slice(2) };

    // track dependencies
    if (tag in components && components[tag].sourceFile) {
        tree.messages.push({
            type: "dependency",
            file: components[tag].sourceFile,
            from: tree.options.from,
        });
    }

    // convert attributes and children to React
    if (attrs) {
        Object.keys(attrs).map((attr) => {
            const prop = attr in attrToProp ? attrToProp[attr] : attr;
            props[prop] = attrs[attr];
        });
    }
    let children = null;
    if (Array.isArray(node.content)) {
        children = node.content.map((child) =>
            typeof child === "string" ? child : toReact(child, components, tree)
        );
    }

    return react.createElement(element, props, children);
}

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

/** Replaces elements with static renderings of React componets
 * @param {{[name:string]: string}} paths An element name -> React component path map
 */
module.exports = function (paths = {}) {
    const matchers = matchHelper(
        Object.keys(paths)
            .filter((k) => typeof paths[k] === "string")
            .join(", ")
    );
    return function posthtmlStaticReact(tree) {
        // import all the paths we've been given
        // we do this here instead of in the outer scope to support HMR
        const components = Object.keys(paths).reduce((comps, name) => {
            if (typeof paths[name] !== "string") {
                return comps;
            }
            comps[name] = requireUncached(paths[name]);
            comps[name].sourceFile = paths[name];
            return comps;
        }, {});

        // then replace the appropriate nodes
        tree.match(matchers, (node) => {
            const rendered = reactServer.renderToStaticMarkup(
                toReact(node, components, tree)
            );
            return parser(rendered);
        });
    };
};
