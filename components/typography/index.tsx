type TitleProps<C extends React.ElementType<any>> = {
    plain?: boolean;
} & React.ComponentPropsWithoutRef<C>;

// TODO: extract into HOC to avoid repetition
export const H1 = ({ plain = false, children, ...props }: TitleProps<"h1">) => {
    return (
        <h1 {...props}>
            {children}
            {plain ? null : <span className="highlight">.</span>}
        </h1>
    );
};
export const H2 = ({ plain = false, children, ...props }: TitleProps<"h2">) => {
    return (
        <h2 {...props}>
            {children}
            {plain ? null : <span className="highlight">.</span>}
        </h2>
    );
};
export const H3 = ({ plain = false, children, ...props }: TitleProps<"h3">) => {
    return (
        <h3 {...props}>
            {children}
            {plain ? null : <span className="highlight">.</span>}
        </h3>
    );
};
