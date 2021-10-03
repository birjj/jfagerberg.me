import styles from "../../styles/Home.module.scss";

export interface PageProps extends React.ComponentPropsWithoutRef<"section"> {
    hero?: boolean;
}
const Page = ({ hero = false, children, className, ...props }: PageProps) => {
    const cls = [
        styles.page,
        className || "",
        hero ? styles["page--hero"] : "",
    ].join(" ");
    return (
        <section {...props} className={cls}>
            {children}
        </section>
    );
};
export default Page;
