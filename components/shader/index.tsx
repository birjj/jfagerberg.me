import React, { useCallback, useRef } from "react";
import WebGLCanvas from "../webgl";
import shader from "./shader.frag";

const ShaderCanvas = () => {
  const $canvas = useRef<HTMLCanvasElement>(null);
  const startTime = useRef<number>(performance.now());

  const uniformsGetter = useCallback(() => {
    if (!$canvas.current) {
      return {};
    }
    return {
      u_resolution: [$canvas.current.width, $canvas.current.height] as [
        number,
        number
      ],
      u_time: (performance.now() - startTime.current) / 1000,
    };
  }, [$canvas, startTime]);

  return (
    <WebGLCanvas
      shader={shader}
      ref={$canvas}
      uniformsGetter={uniformsGetter}
    />
  );
};
export default ShaderCanvas;
