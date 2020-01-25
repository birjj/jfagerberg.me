import React from "react";
import PropTypes from "prop-types";
import yamz from "yet-another-medium-zoom";

import Page, { PageProps } from "../page";

interface PageWithYamzProps extends PageProps {
    target: string;
}
export default class PageWithYamz extends React.Component<PageWithYamzProps> {
    static propTypes = {
        ...Page.propTypes,
        target: PropTypes.string,
    };
    static defaultProps = {
        ...Page.defaultProps,
        target: ".gatsby-resp-image-link > picture, *:not(picture) > img",
    };

    onLinkClick = (e: MouseEvent) => {
        const shouldOpen = e.ctrlKey || e.shiftKey;
        if (shouldOpen) {
            e.stopPropagation();
        } else {
            e.preventDefault();
        }
    };

    onRef = ($wrapper: HTMLElement | null) => {
        if (!$wrapper) {
            return;
        }
        const $pictures = Array.from(
            $wrapper.querySelectorAll(this.props.target)
        ) as HTMLPictureElement[];
        $pictures.forEach($picture => {
            const $a = $picture.closest("a");
            if (!$a) {
                return;
            }

            $a.addEventListener("click", this.onLinkClick, { capture: true });
        });
        yamz.bind($pictures, {});
    };

    render() {
        const { target, ...props } = this.props;
        return (
            <Page {...props} ref={this.onRef}>
                {this.props.children}
            </Page>
        );
    }
}
