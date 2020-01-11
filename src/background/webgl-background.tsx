import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import ShaderProgram, { WebGLUniforms } from "./webgl/shader-program";
import EasedVec2 from "./eased-vector";
import vertShader from "./shaders/background.vert";
import fragShader from "./shaders/background.frag";
import getPathDetails from "./path-classifier";

const PAUSE_TRANSITION_LEN = 500;

const Canvas = styled.canvas`
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    opacity: 1;
    transition: opacity ${PAUSE_TRANSITION_LEN}ms;
`;

const easedOffset = new EasedVec2(0, 0, 200); // x = path level range:[-1,1], y = scroll position range:[0,1]
const updateScrollOffset = () => {
    easedOffset.setY(
        window.scrollY / (document.body.offsetHeight - window.innerHeight)
    );
};

if (typeof window !== "undefined") {
    window.addEventListener("scroll", updateScrollOffset);
    window.addEventListener("resize", updateScrollOffset);
}

export interface WebGLBackgroundProps {
    path: string;
}
interface WebGLBackgroundState {
    path: string;
    pathLevel: number;
    shown: boolean;
}

export class WebGLBackground extends React.PureComponent<
    WebGLBackgroundProps,
    WebGLBackgroundState
> {
    $canvas?: HTMLCanvasElement;
    ctx?: WebGL2RenderingContext;
    program?: ShaderProgram;
    _pausedTimeout?: number;
    uniforms?: WebGLUniforms;

    constructor(props: WebGLBackgroundProps) {
        super(props);
        this.state = WebGLBackground.getDerivedStateFromProps(props);
    }

    static getDerivedStateFromProps(props: WebGLBackgroundProps) {
        const path = props.path || "";
        const pathDetails = getPathDetails(path);
        easedOffset.setX(pathDetails.level);
        easedOffset.temporarilySetDuration(400);
        return {
            path: path,
            pathLevel: pathDetails.level,
            shown: pathDetails.show,
        };
    }

    componentDidMount() {
        // creates our ShaderProgram
        /** @type {HTMLCanvasElement} */
        this.$canvas = document.getElementById(
            "bg-canvas"
        ) as HTMLCanvasElement;
        this.ctx = this.$canvas.getContext("webgl") as WebGL2RenderingContext;
        this.ctx.clearColor(0, 0, 0, 1);
        this.program = new ShaderProgram(
            this.ctx,
            vertShader,
            fragShader,
            this.getUniforms
        );
        this.program.setPaused(!this.state.shown);
        this.resizeCanvasToWindow();

        window.addEventListener("resize", this.resizeCanvasToWindow);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeCanvasToWindow);
        if (this.program) {
            this.program.setPaused(true);
        }
    }

    componentDidUpdate() {
        this.updatePaused();
    }

    updatePaused = () => {
        // unpause immediately if we are going to show, pause delayed if we are hiding
        if (this.state.shown && this.program) {
            this.program.setPaused(!this.state.shown);
        } else {
            clearTimeout(this._pausedTimeout);
            this._pausedTimeout = setTimeout(() => {
                if (!this.program) {
                    return;
                }
                this.program.setPaused(!this.state.shown);
            }, PAUSE_TRANSITION_LEN);
        }
    };

    getUniforms = () => {
        // we reuse the object to avoid memory pollution
        if (!this.uniforms) {
            this.uniforms = {};
        }
        this.uniforms.u_offset = easedOffset.vec;
        return this.uniforms;
    };

    resizeCanvasToWindow = () => {
        if (!this.$canvas || !this.ctx || !this.program) {
            return;
        }
        this.$canvas.width = window.innerWidth;
        this.$canvas.height = window.innerHeight;
        this.ctx.viewport(0, 0, this.$canvas.width, this.$canvas.height);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
        this.program.draw();
    };

    render() {
        const style = {
            opacity: this.state.shown ? 1 : 0,
            transitionTimingFunction: this.state.shown ? "ease-out" : "ease-in",
        };

        return <Canvas id="bg-canvas" style={style} />;
    }
}

export default WebGLBackground;
