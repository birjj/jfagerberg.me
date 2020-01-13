import React from "react";
import { ThemeProvider } from "styled-components";
import { StaticQuery, graphql } from "gatsby";
import GlobalStyle, { theme } from "./global-style";

interface LayoutProps {
    children: JSX.Element | JSX.Element[];
    leftAligned?: boolean;
}

const Layout: React.FunctionComponent<LayoutProps> = ({
    children,
    leftAligned = false,
}) => (
    <StaticQuery
        query={graphql`
            query SiteTitleQuery {
                site {
                    siteMetadata {
                        title
                    }
                }
            }
        `}
        render={() => (
            <ThemeProvider
                theme={{
                    ...theme,
                    leftAligned,
                }}
            >
                <GlobalStyle />
                {children}
            </ThemeProvider>
        )}
    ></StaticQuery>
);
export default Layout;
