import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        width: string;
        color: string;
        gutter: string;
        leftAligned?: boolean;
    }
}