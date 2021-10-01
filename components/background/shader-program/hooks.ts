import { useCallback, useEffect, useRef } from "react";
import ShaderProgram from ".";
import { WebGLUniformsGetter } from "./types";

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
