import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "gatsby";

const Wrapper = styled.div`
    padding: 2em 0 1em;
    display: flex;
    align-items: center;
    max-width: ${props => props.theme.width};

    @media (max-width: 600px) {
        padding: 1em 0;
    }

    p {
        margin: 0;
    }

    > svg {
        align-self: flex-start;
        flex-shrink: 0;
        width: 96px;
        height: 96px;
        margin-right: 0.5em;
        fill: #fff;

        @media (max-width: 712px) {
            width: 64px;
            height: 64px;
        }
        @media (max-width: 600px) {
            display: none;
        }
    }

    &:last-child {
        padding-bottom: 0;
    }
`;

const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Technologies = styled.span`
    margin: 0 2ch;
    font-size: 16px;
    color: #aaa;
    vertical-align: middle;
    padding-bottom: 0.2em;
`;

const ReadMore = styled.a`
    float: right;
    margin: 1em 0.5em 0;

    &::after {
        bottom: 7px;
    }

    svg {
        height: 1em;
        fill: currentColor;
        vertical-align: middle;
    }
`;

interface ProjectProps {
    title: string | JSX.Element;
    icon: JSX.Element;
    technologies: string[];
    href: string;
    readMoreHref?: string;
    children: JSX.Element | JSX.Element[] | string;
}

const Project: React.FunctionComponent<ProjectProps> = ({
    title,
    icon,
    technologies,
    href,
    readMoreHref,
    children,
}) => (
    <Wrapper>
        {icon}
        <TextWrapper>
            <h3>
                <a href={href} target="_blank" rel="noopener noreferrer">
                    {title}
                </a>
                <Technologies>{technologies.join(" ⋅ ")}</Technologies>
            </h3>
            <p>
                {children}
                {readMoreHref && (
                    <ReadMore as={Link} to={readMoreHref}>
                        Read more
                    </ReadMore>
                )}
            </p>
        </TextWrapper>
    </Wrapper>
);
export default Project;
