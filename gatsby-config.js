module.exports = {
    siteMetadata: {
        title: `Johan Fagerberg`,
        description: `Frontend developer, with a love for finding new ways to improve the development experience`,
        author: `@birjolaxew`,
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `pages`,
                path: `${__dirname}/src/pages`,
            },
        },
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-plugin-sharp`,
            options: {
                stripMetadata: true,
                defaultQuality: 100,
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-external-links`,
                        options: {
                            target: `_blank`,
                            rel: `noopener noreferrer`,
                        },
                    },
                    `gatsby-remark-component`,
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 800,
                            withWebp: true,
                            quality: 100,
                            wrapperStyle: fluid =>
                                `max-width: ${(fluid.aspectRatio * 100).toFixed(
                                    2
                                )}vh;`,
                        },
                    },
                    `gatsby-remark-copy-linked-files`,
                    `gatsby-remark-unwrap-images`,
                    {
                        resolve: `gatsby-remark-katex`,
                        options: {
                            strict: true,
                        },
                    },
                    `gatsby-remark-graphviz`,
                ],
            },
        },
        {
            resolve: `gatsby-plugin-react-svg`,
            options: {
                rule: {
                    include: /\.svg$/,
                },
            },
        },
        `gatsby-plugin-styled-components`,
        `gatsby-plugin-sass`,
        `gatsby-plugin-glslify`,
        {
            resolve: `gatsby-plugin-prefetch-google-fonts`,
            options: {
                fonts: [
                    {
                        family: `Roboto`,
                        variants: [`400`],
                    },
                    {
                        family: `Questrial`,
                        variants: [`400`, `700`],
                    },
                    {
                        family: `Merriweather`,
                        variants: [`400`],
                    },
                    {
                        family: `Cousine`,
                        variants: [`400`],
                    },
                ],
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Johan Fagerberg - Frontend developer`,
                short_name: `jfagerberg.me`,
                start_url: `/`,
                background_color: `#2b2b30`,
                theme_color: `#0BB1D2`,
                display: `browser`,
                icon: `src/assets/favicon.svg`,
            },
        },
        `gatsby-plugin-typescript`,
        {
            resolve: `gatsby-plugin-layout`,
            options: {
                component: require.resolve(`./src/global-wrapper.tsx`),
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // `gatsby-plugin-offline`,
    ],
};
