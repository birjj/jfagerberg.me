import styled from "styled-components";

export const Picture = styled.picture`
    display: block;
    margin: 0 auto 0;
    max-height: 100vh;
    max-width: 100%;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
`;

export const PictureGrid = styled.div<{ columns: number }>`
    margin: 0 -0.25em 2em;
    max-width: calc(100% + 0.5em);
    display: flex;
    flex-wrap: wrap;

    > * {
        flex-basis: ${props => Math.floor(100 / (props.columns || 3)) - 1}%;
        flex-grow: 1;
        margin: 0 auto;

        > * {
            margin: 0.25em;
        }
    }

    > .full {
        flex-basis: 100%;
    }

    ${Picture} {
        margin-bottom: 0;
    }
`;
