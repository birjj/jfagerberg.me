import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.div`
    padding: 1em 0 0;
    display: flex;
    max-width: ${props => props.theme.width};

    @media (max-width: 712px) {
        flex-direction: column;
    }
`;

const Duration = styled.div`
    margin: 0 2ch 1ch 0;
    font-size: 16px;
    color: #aaa;
    flex-shrink: 0;
`;

interface WorkProps {
    title: string;
    duration: JSX.Element | string;
    children: JSX.Element | JSX.Element[] | string;
}

const Work: React.FunctionComponent<WorkProps> = ({
    title,
    duration,
    children,
}) => (
    <Wrapper>
        <Duration>{duration}</Duration>
        <div>
            <h3>{title}</h3>
            {children}
        </div>
    </Wrapper>
);
export default Work;
