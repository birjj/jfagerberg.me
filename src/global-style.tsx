import { createGlobalStyle } from "styled-components";

export const theme = {
    width: "65ch",
    color: "#fff",
    gutter: "4ch", // how much content that overflows width should overflow
};

export default createGlobalStyle`
    * { box-sizing: border-box; }
    body {
        margin: 0;
        color: ${props => props.theme.color};
        background: #222227;
        font-family: "Roboto", serif;
        font-size: 22px;
        line-height: 1.6;
        padding: 0 15vw;

        @media (max-width: 912px) { padding: 0 10vw; }
        @media (max-width: 712px) { padding: 0 5vw; }
    }

    h1, h2, h3, h4 {
        margin: 0;
        line-height: initial;
        font-family: "Questrial", sans-serif;
    }
    h1 { font-size: 3em; }
    h2 { font-size: 2em; }
    h3 { color: #eee; }
    h4 { display: inline-block; }
    p { margin: 0.5em 0; }
    svg { fill: currentColor; }

    /* make gatsby-images placeholder image blurry */
    .gatsby-resp-image-link { overflow: hidden; }
    .gatsby-resp-image-background-image,
    .gatsby-image-wrapper > img:first-child {
        filter: blur(8px);
        transform: scale(1.1);
    }

    /* style links globally */
    a:not(.icon) {
        font-style: initial;
        position: relative;
        color: inherit;
        text-decoration: none;
        z-index: 1;
        cursor: pointer;

        background-image: linear-gradient(rgba(14, 177, 210, 0.75), rgba(14, 177, 210, 0.75));
        background-position: 0% 100%;
        background-repeat: no-repeat;
        background-size: 100% 2px;

        &:hover {
            background-image: linear-gradient(#0EB1D2, #0EB1D2);
        }

        .gatsby-resp-image-wrapper & {
            background-image: none;
        }
    }

    a.icon {
        &:focus, &:hover {
            svg {
                filter: drop-shadow(0 3px rgba(14, 177, 210, 0.5));
            }
        }
    }
`;
