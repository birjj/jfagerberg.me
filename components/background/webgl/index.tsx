import React, { useEffect, useRef, useState } from "react";
import WebGLHandler, { WebGLUniforms } from "./webgl";

type ShaderCanvasProps = {
  shader: string;
  uniformsGetter?: (prev: WebGLUniforms) => WebGLUniforms;
  fallback?: React.ReactNode;
} & JSX.IntrinsicElements["canvas"];
const WebGLCanvas = React.forwardRef<HTMLCanvasElement, ShaderCanvasProps>(
  ({ shader, uniformsGetter, fallback = null, ...props }, ref) => {
    const $canvas = useRef<HTMLCanvasElement>(null);
    const webgl = useRef<WebGLHandler>();
    const [isSupported, setSupported] = useState<boolean | undefined>(
      undefined
    );
    useEffect(() => {
      setSupported(isWebGLSupported());
    }, []);

    const onCanvas = ($c: HTMLCanvasElement | null) => {
      ($canvas as React.MutableRefObject<HTMLCanvasElement | null>).current =
        $c;
      if (typeof ref === "function") {
        ref($c);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = $c;
      }
    };

    // create our handler instance
    useEffect(() => {
      if (!supported || !$canvas.current) {
        return;
      }
      webgl.current = new WebGLHandler($canvas.current, shader, uniformsGetter);
      return () => {
        webgl.current?.destroy();
        webgl.current = undefined;
      };
    }, [isSupported]);

    // load our shader whenever it changes
    useEffect(() => {
      if (!webgl.current) {
        return;
      }
      webgl.current.setShader(shader);
    }, [webgl, shader]);

    // update the shader with uniforms when they change
    useEffect(() => {
      if (!webgl.current) {
        return;
      }
      webgl.current.setUniformsGetter(uniformsGetter);
    }, [webgl, uniformsGetter]);

    if (isSupported === undefined) {
      return null;
    }
    return isSupported ? <canvas ref={onCanvas} {...props} /> : <>{fallback}</>;
  }
);
export default WebGLCanvas;

let supported: boolean | undefined = undefined;
const isWebGLSupported = () => {
  if (typeof document === "undefined") {
    return false;
  }
  if (supported === undefined) {
    const $canvas = document.createElement("canvas");
    supported =
      !!$canvas.getContext("webgl") ||
      !!$canvas.getContext("experimental-webgl");
  }
  return supported;
};
