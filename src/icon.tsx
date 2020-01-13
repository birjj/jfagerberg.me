import React from "react";

import ArrowRight from "./assets/icons/arrow-right.svg";
import ArrowLeft from "./assets/icons/arrow-left.svg";
import Play from "./assets/icons/play.svg";
import GitHub from "./assets/icons/github.svg";
import LinkedIn from "./assets/icons/linkedin.svg";
import SVGLint from "./assets/icons/svglint.svg";
import ConsoleStream from "./assets/icons/console-stream.svg";
import FlippyJS from "./assets/icons/flippyjs.svg";
import Brookshear from "./assets/icons/brookshear.svg";
import SMTPListener from "./assets/icons/smtp-listener.svg";
import YAMZ from "./assets/icons/yamz.svg";

const nameToComponent = {
    "arrow-right": ArrowRight,
    "arrow-left": ArrowLeft,
    play: Play,
    github: GitHub,
    linkedin: LinkedIn,
    svglint: SVGLint,
    "console-stream": ConsoleStream,
    flippyjs: FlippyJS,
    brookshear: Brookshear,
    "smtp-listener": SMTPListener,
    yamz: YAMZ,
};

interface IconProps {
    name: keyof typeof nameToComponent;
}
const Icon = ({ name, ...props }: IconProps) => {
    const Comp = nameToComponent[name];
    return Comp ? <Comp {...props} /> : null;
};
export default Icon;
