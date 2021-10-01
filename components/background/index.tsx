import FragmentShader from "./shaders/background.frag";
import VertexShader from "./shaders/background.vert";

import styles from "./index.module.scss";
import { useWebGLSupport, useWindowSize } from "./hooks";
import { useShaderProgram } from "./shader-program/hooks";
import EasedVec2 from "./shader-program/eased-vector";
import { useCallback, useEffect, useRef } from "react";

type BackgroundProps = {
    children: React.ReactNode;
};

const Background = ({ children }: BackgroundProps) => {
    const shouldRender = useWebGLSupport();
    const size = useWindowSize();

    // setup stuff needed for shader (including uniforms we're going to pass to it)
    const scrollVec = useRef(new EasedVec2(0, 0, 200));
    const uniforms = useRef({ u_offset: [0, 0] as [number, number] }); // reuse single object to avoid DDoS'ing the garbage collector
    const getUniforms = useCallback(() => {
        uniforms.current.u_offset = scrollVec.current.vec;
        return uniforms.current;
    }, []);
    const { canvasHandler } = useShaderProgram(
        VertexShader,
        FragmentShader,
        getUniforms
    );

    // update our uniforms as needed
    useEffect(() => {
        const updateScrollOffset = () => {
            const scrollHeight =
                document.body.offsetHeight - window.innerHeight;
            const scrollDist = window.scrollY;

            scrollVec.current.setY(
                scrollDist / Math.max(scrollHeight, scrollDist)
            );
        };
        window.addEventListener("scroll", updateScrollOffset);
        return () => window.removeEventListener("scroll", updateScrollOffset);
    }, []);

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
