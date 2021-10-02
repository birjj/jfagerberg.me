import { useEffect, useState } from "react";

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
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        listener();
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [setSize]);

    return size;
}
