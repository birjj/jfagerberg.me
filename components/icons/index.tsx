/** Paths will be inserted as a single <path> in a 24x24 SVG.
 * Name is used for CSS class name */
const paths = {
    "arrow-left":
        "M7.84,11l5.5-5.5l-1.42-1.42L4,12l7.92,7.92l1.42-1.42L7.84,13h12v-2H7.84z",
};

const iconFactory = (name: keyof typeof paths) => {
    const Icon = ({
        className,
        ...props
    }: React.ComponentPropsWithoutRef<"svg">) => {
        return (
            <svg
                viewBox="0 0 24 24"
                className={`icon icon--${name} ${className || ""}`}
                {...props}
            >
                <path d={paths[name]} />
            </svg>
        );
    };
    return Icon;
};

// export individual icons
export const ArrowLeft = iconFactory("arrow-left");
