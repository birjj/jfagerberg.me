import styles from "../../styles/Home.module.scss";

export interface WorkProps extends React.ComponentPropsWithoutRef<"div"> {
    from: string;
    to: string;
    name: React.ReactNode;
}
const Work = ({ from, to, name, children }: WorkProps) => {
    // simplify "2021 - 2021" to "2021"
    const duration = from === to ? from : `${from} - ${to}`;

    return (
        <div className={styles.work}>
            <div className={styles.work__duration}>{duration}</div>
            <div className={styles.work__text}>
                <h3>{name}</h3>
                {children}
            </div>
        </div>
    );
};
export default Work;
