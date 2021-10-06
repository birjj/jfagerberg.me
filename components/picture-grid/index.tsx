import Image, { ImageProps } from "next/image";
import Link from "../link";
import styles from "./picture-grid.module.scss";

type ImportedImage = {
    src: string;
    height: number;
    width: number;
    blurDataURL: string;
};
type PictureGridProps = {
    columns?: number;
    children: [{ img: ImportedImage } & ImageProps];
};
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
            {children.map(({ img, ...props }) => {
                return (
                    <Link
                        key={img.src}
                        href={img.src}
                        className={styles["img-link"]}
                        target="_blank"
                    >
                        <Image
                            alt={props.alt} /* ESLint workaround */
                            layout="responsive"
                            {...props}
                            src={img}
                            placeholder="blur"
                        />
                    </Link>
                );
            })}
        </div>
    );
};
export default PictureGrid;
