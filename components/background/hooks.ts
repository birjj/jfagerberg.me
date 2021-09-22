import { useCallback, useEffect, useRef, useState } from "react";
import ShaderProgram, { WebGLUniformsGetter } from "./shader-program";

/** Hook checking whether WebGL is supported */
export function useWebGLSupport(ssrValue: boolean = true) {
    function supportsWebGL() {
        if (typeof document === "undefined") {
            return false;
        }
        const value = document.createElement("canvas")?.getContext("webgl");
        return !!(value && value instanceof WebGLRenderingContext);
    }

    const [supported, setSupported] = useState(ssrValue);
    useEffect(() => {
        setSupported(supportsWebGL());
    }, [setSupported]);
    return supported;
}

/** Hook providing the current size of the window (0x0 for SSR) */
export function useWindowSize() {
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });

    // listen for window resizes and update size
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

    return size;
}

/** Interface with a ShaderProgram. Creates a ShaderProgram and keeps it attached to a canvas.
 * The returned canvasHandler must be set as ref for the <canvas> */
export function useShaderProgram(
    vertex: string,
    fragment: string,
    uniformsGetter: WebGLUniformsGetter
) {
    const shaderProgram = useRef(undefined as ShaderProgram | undefined);
    const canvas = useRef(undefined as HTMLCanvasElement | undefined);

    // called when the canvas DOM element changes
    const canvasHandler = useCallback(($canvas?: HTMLCanvasElement | null) => {
        canvas.current = $canvas || undefined;
        shaderProgram.current?.setContext(
            $canvas?.getContext("webgl") || undefined
        );
        shaderProgram.current?.draw();
    }, []);

    // create our ShaderProgram instance
    useEffect(() => {
        if (shaderProgram.current) {
            shaderProgram.current.destroy();
        }
        shaderProgram.current = new ShaderProgram(
            vertex,
            fragment,
            uniformsGetter
        );
        canvasHandler(canvas.current);
        return () => shaderProgram.current?.setContext(undefined);
    }, [vertex, fragment, uniformsGetter, canvasHandler]);

    return { canvasHandler };
}
