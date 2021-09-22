import FragmentShader from "./shaders/background.frag";
import VertexShader from "./shaders/background.vert";

import styles from "./index.module.scss";
import { useShaderProgram, useWebGLSupport, useWindowSize } from "./hooks";

type BackgroundProps = {
    children: React.ReactNode;
};

const UniformsGetter = () => {
    return {
        u_offset: [0, 0] as [number, number],
    };
};

const Background = ({ children }: BackgroundProps) => {
    const shouldRender = useWebGLSupport();
    const size = useWindowSize();
    const { canvasHandler } = useShaderProgram(
        VertexShader,
        FragmentShader,
        UniformsGetter
    );

    return (
        <>
            {shouldRender && (
                <canvas
                    className={styles.canvas}
                    ref={canvasHandler}
                    width={size.width}
                    height={size.height}
                />
            )}
            {children}
        </>
    );
};

export default Background;
