import styles from "./picture-grid.module.scss";

type PictureGridProps = React.PropsWithChildren<{
    columns?: number;
}>;
const PictureGrid = ({ columns = 2, children }: PictureGridProps) => {
    return (
        <div
            className={styles.wrapper}
            style={
                {
                    "--column-width": `${Math.floor(100 / columns)}%`,
                } as React.CSSProperties
            }
        >
            {children}
        </div>
    );
};
export default PictureGrid;
