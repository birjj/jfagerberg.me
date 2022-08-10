import React, { useCallback, useRef } from "react";
import useResizeObserver from "use-resize-observer";

import WebGLCanvas from "../webgl";
import shader from "./shader.frag";

import style from "./style.module.css";

/** Canvas that renders our background shader */
const ShaderCanvas = ({
  className,
  ...props
}: JSX.IntrinsicElements["canvas"]) => {
  const $canvas = useRef<HTMLCanvasElement>(null);
  const {
    width = 1,
    height = 1,
    ref: canvasRef,
  } = useResizeObserver<HTMLCanvasElement>({
    ref: $canvas,
  });
  const startTime = useRef<number>(performance.now());

  const onCanvas = ($c: HTMLCanvasElement | null) => {
    ($canvas as React.MutableRefObject<HTMLCanvasElement | null>).current = $c;
    canvasRef($c);
  };

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
      u_scroll:
        typeof document === "undefined"
          ? 0.0
          : (document.body.scrollTop || document.documentElement.scrollTop) +
            0.0001,
    };
  }, [$canvas, startTime]);

  return (
    <WebGLCanvas
      width={width}
      height={height}
      className={`${style.canvas} ${className || ""}`}
      shader={shader}
      ref={onCanvas}
      uniformsGetter={uniformsGetter}
    />
  );
};
export default ShaderCanvas;
