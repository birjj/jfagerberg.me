import styled from "styled-components";

interface PageProps {
    full?: boolean;
    centered?: boolean;
}
const Page = styled.div<PageProps>`
    padding: ${props => (props.full ? "10vh 0" : "10vh 0 2em")};
    display: flex;
    flex-direction: column;
    justify-content: ${props => (props.centered ? "center" : "flex-start")};
    ${props => props.full && "min-height: 100vh;"}
    ${props => !props.full && `max-width: ${props.theme.width};`}
    ${props =>
        !props.theme.leftAligned && `margin-left auto; margin-right: auto;`}

    &:last-child {
        padding-bottom: 10vh;
    }
`;

export default Page;
