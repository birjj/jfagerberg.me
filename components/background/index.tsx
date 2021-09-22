import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import ShaderProgram from "./shader-program";
import FragmentShader from "./shaders/background.frag";
import VertexShader from "./shaders/background.vert";

import styles from "./index.module.scss";

type BackgroundProps = {
    children: React.ReactNode;
};

const UniformsGetter = () => {
    return {
        u_offset: [0, 0] as [number, number],
    };
};

const Background = ({ children }: BackgroundProps) => {
    const shaderProgram = useRef(undefined as ShaderProgram | undefined);
    const canvas = useRef(undefined as HTMLCanvasElement | undefined);
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });

    // create our ShaderProgram instance
    useEffect(() => {
        if (shaderProgram.current) {
            return;
        }
        shaderProgram.current = new ShaderProgram(
            VertexShader,
            FragmentShader,
            UniformsGetter
        );
        canvasHandler(canvas.current);
        return () => shaderProgram.current?.setContext(undefined);
    }, []);

    // called when the canvas DOM element changes (i.e. on attach/detach of the <Background>)
    const canvasHandler = useCallback(($canvas?: HTMLCanvasElement | null) => {
        canvas.current = $canvas || undefined;
        shaderProgram.current?.setContext(
            $canvas?.getContext("webgl") || undefined
        );
        shaderProgram.current?.draw();
    }, []);

    // listen for window resizes and update canvas sizing
    useEffect(() => {
        const listener = () => {
            setSize({
                width: document.body.clientWidth,
                height: document.body.clientHeight,
            });
        };
        listener();
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [setSize]);

    return (
        <>
            <canvas
                className={styles.canvas}
                ref={canvasHandler}
                width={size.width}
                height={size.height}
            />
            {children}
        </>
    );
};

export default Background;
