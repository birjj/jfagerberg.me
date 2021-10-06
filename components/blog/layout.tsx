import React from "react";
import { ArrowLeft } from "../icons";
import Link from "../link";

import styles from "./blog.module.scss";

type BlogLayoutProps = {
    date?: string;
};
const BlogLayout = ({
    date,
    children,
}: React.PropsWithChildren<BlogLayoutProps>) => {
    return (
        <div className={styles.wrapper}>
            <nav>
                <Link href="/">
                    <ArrowLeft />
                    Home
                </Link>
                <span className={styles.date}>{date}</span>
            </nav>
            {children}
        </div>
    );
};

export const withLayout = (data: BlogLayoutProps) => {
    const WrappedLayout = ({
        ...props
    }: React.ComponentPropsWithoutRef<"div">) => {
        return <BlogLayout {...data} {...props} />;
    };
    return WrappedLayout;
};
export default BlogLayout;
