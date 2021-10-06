import styles from "./blog.module.scss";
import { H1 } from "../typography";

type HeaderProps = React.PropsWithChildren<{
    subtext?: React.ReactNode;
}>;
export const Header = ({ children, subtext }: HeaderProps) => {
    return (
        <div className={styles["header"]}>
            <H1>{children}</H1>
            {subtext ? <small>{subtext}</small> : null}
        </div>
    );
};
