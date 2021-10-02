import NextLink from "next/link";
import React from "react";

const remoteRegex = /^https?:\/\//;

interface LinkProps
    extends Omit<React.ComponentPropsWithoutRef<"a">, "target"> {
    href: string;
}
const Link = ({ href, children, ...props }: LinkProps) => {
    const remote = remoteRegex.test(href);

    // if it's local, just pass it through to
    if (!remote) {
        return <NextLink href={href}>{children}</NextLink>;
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            {...props}
        >
            {children}
        </a>
    );
};
export default Link;