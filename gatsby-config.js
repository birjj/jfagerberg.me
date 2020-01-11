module.exports = {
    siteMetadata: {
        title: `Gatsby Default Starter`,
        description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
        author: `@gatsbyjs`,
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
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
                    `gatsby-remark-copy-linked-files`,
                ],
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
                component: require.resolve(`./src/wrapper.tsx`),
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // `gatsby-plugin-offline`,
    ],
};
