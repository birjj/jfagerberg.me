import React from "react";
import NextLink from "next/link";

import style from "./link.module.css";
import { GithubIcon } from "../icons";

const DOMAIN_REGEX = /^https?:\/\/(www\.)?jfagerberg\.me\/?/;
const GITHUB_REGEX = /^https?:\/\/(www\.)?github\.com\/?/;

export type LinkProps = {
  href: string;
  noIcon?: boolean;
} & Omit<JSX.IntrinsicElements["a"], "href">;

const Link = React.forwardRef<
  HTMLAnchorElement,
  React.PropsWithChildren<LinkProps>
>(({ href, noIcon = false, children, ...props }, forwardRef) => {
  const sameDomain = DOMAIN_REGEX.test(href);
  if (sameDomain) {
    href = href.replace(DOMAIN_REGEX, "/");
  }

  // use next/link for internal links
  if (href.startsWith("/")) {
    return (
      <NextLink href={href}>
        <a ref={forwardRef} {...props}>
          {children}
        </a>
      </NextLink>
    );
  }

  // add security props to all other links
  const $icon = noIcon ? null : GITHUB_REGEX.test(href) ? (
    <GithubIcon className={style.icon} />
  ) : null;
  return (
    <a
      ref={forwardRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
      {$icon}
    </a>
  );
});

export default Link;
