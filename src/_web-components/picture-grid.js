// Replaces <picture-grid> in HTML files
const react = require("react");

/** Transforms pictures into fancy pictures */
const PictureGrid = ({ columns = 3, children }) => {
    return react.createElement(
        "div",
        {
            style: { "--column-width": `${Math.floor(100 / columns) - 1}%` },
            className: "picture-grid",
        },
        ...children
    );
};

module.exports = PictureGrid;
