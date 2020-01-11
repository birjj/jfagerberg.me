import React from "react";
import WebGLBackground from "./background/webgl-background";
import BackgroundPlaceholder from "./background/placeholder";

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
            <WebGLBackground path={path} />
            {children}
        </>
    );
};
