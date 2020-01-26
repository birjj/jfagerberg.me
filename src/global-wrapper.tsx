import React from "react";
import WebGLBackground from "./background/webgl-background";
import BackgroundPlaceholder from "./background/placeholder";

function supportsWebGL() {
    try {
        const $canvas = document.createElement("canvas");
        if (!$canvas.getContext("webgl")) {
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}

export default ({
    children,
    path,
}: {
    children: JSX.Element;
    path: string;
}) => {
    return (
        <>
            <BackgroundPlaceholder />
            {supportsWebGL() ? <WebGLBackground path={path} /> : null}
            {children}
        </>
    );
};
