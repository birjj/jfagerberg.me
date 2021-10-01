/**
 * @fileoverview A generic ShaderProgram for handling drawing of WebGL shaders
 */

import { WebGLUniformsGetter, WebGLUniforms } from "./types";

/**
 * Runs a WebGL shader
 * Shaders are given the uniforms returned by `uniformsGetter`
 * Also given:
 *   attribute a_position:      the current pixel
 *   uniform float u_time:      the current timestamp
 *   uniform vec2 u_resolution: the size of the canvas
 */
export default class ShaderProgram {
    private gl?: WebGLRenderingContext;
    private vertex?: WebGLShader;
    private vertexSource: string;
    private fragment?: WebGLShader;
    private fragmentSource: string;
    private program?: WebGLProgram;

    private uniformsGetter: WebGLUniformsGetter;
    private uniforms?: WebGLUniforms;
    private positions?: { [k: string]: number | WebGLUniformLocation };
    private positionBuffer!: WebGLBuffer;

    private startTime: number;
    private paused: boolean = false;
    private animTimeout?: number;

    constructor(
        /** The vertex shader source code */
        vertex: string,
        /** The fragment shader source code */
        fragment: string,
        /** A function that returns the uniforms to pass to the shaders */
        uniformsGetter: WebGLUniformsGetter
    ) {
        this.draw = this.draw.bind(this);
        this.startTime = Date.now();

        this.vertexSource = vertex;
        this.fragmentSource = fragment;
        this.uniformsGetter = uniformsGetter;
    }

    destroy() {
        if (this.animTimeout !== undefined) {
            cancelAnimationFrame(this.animTimeout);
        }
        this.gl = this.program = undefined;
    }

    /** Changes the context we're drawing to. Must be called before we can draw */
    setContext(gl?: WebGLRenderingContext) {
        if (!gl) {
            this.gl = this.program = undefined;
            if (this.animTimeout !== undefined) {
                cancelAnimationFrame(this.animTimeout);
            }
            return;
        }

        this.gl = gl;
        try {
            // generate the shaders
            this.vertex = this.createShader(
                this.vertexSource,
                gl.VERTEX_SHADER
            );
            this.fragment = this.createShader(
                this.fragmentSource,
                gl.FRAGMENT_SHADER
            );

            // generate the program
            this.program = this.createProgram(this.vertex, this.fragment);

            // update the uniform positions
            this.positions = {
                a_position: gl.getAttribLocation(this.program, "a_position"),
            };
            this.uniforms = this.getUniforms();
            Object.keys(this.uniforms).forEach((key) => {
                const location = gl.getUniformLocation(this.program!, key);
                if (location) {
                    this.positions![key] = location;
                }
            });

            // create the plane we will draw onto
            this.positionBuffer = gl.createBuffer() as WebGLBuffer;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            const positions = [-1, 1, 1, 1, -1, -1, 1, -1];
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW
            );
        } catch (err) {
            console.warn("Failed when setting up WebGL drawing:", err);
            this.gl = this.program = undefined;
        }
    }

    /** Gets the uniforms, including custom ones */
    getUniforms(): WebGLUniforms {
        return {
            u_time: Date.now() - this.startTime,
            u_resolution: [
                this.gl?.canvas.width || 0,
                this.gl?.canvas.height || 0,
            ],
            ...this.uniformsGetter(this.gl),
        };
    }

    /** Creates a program object from two shaders */
    createProgram(vertex: WebGLShader, fragment: WebGLShader) {
        const gl = this.gl;
        const program = gl?.createProgram();
        if (!gl || !program) {
            throw new Error("Couldn't create WebGL program");
        }

        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(
                `Failed when creating program\n${gl.getProgramInfoLog(program)}`
            );
        }
        return program;
    }

    /** Creates a shader object from some source code */
    createShader(source: string, type: number) {
        const gl = this.gl;
        const shader = gl?.createShader(type);
        if (!gl || !shader) {
            throw new SyntaxError("Couldn't compile shader");
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new SyntaxError(
                `Failed to compile shader\n${gl.getShaderInfoLog(shader)}`
            );
        }
        return shader;
    }

    /** Set whether we are paused */
    setPaused(paused: boolean) {
        this.paused = paused;
        this.draw();
    }

    /** Actually draws; executes itself after it has first been called */
    draw(t?: number) {
        // make sure we don't queue up two draws
        if (this.animTimeout !== undefined) {
            cancelAnimationFrame(this.animTimeout);
        }
        if (this.paused) {
            console.warn("Stopping automatic draw due to pausing");
            return;
        }

        // grab our context, exit early if we don't have one (drawing before calling .setContext, WebGL not supported, ...)
        const gl = this.gl;
        if (!gl) {
            console.warn("Attempted to draw without a WebGL context");
            return;
        }

        // clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // tell webgl to use the program, and allow the position attribute
        gl.useProgram(this.program!);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.enableVertexAttribArray(this.positions!.a_position as number);

        // bind this.positionBuffer to ARRAY_BUFFER as points
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(
            this.positions!.a_position as number, // variable to bind into
            2, // number of values to pull per point
            gl.FLOAT, // type of values to pull
            false, // no effect, since type = FLOAT
            0, // figure out stride from above values
            0 // no offset before values
        );

        // set our uniforms
        this.uniforms = this.getUniforms();
        Object.keys(this.uniforms).forEach((key) => {
            if (!this.positions![key]) {
                return;
            }
            const value = this.uniforms![key];
            if (typeof value === "number") {
                gl.uniform1f(this.positions![key], value);
            } else if (value instanceof Array && value.length === 2) {
                gl.uniform2f(this.positions![key], value[0], value[1]);
            }
        });

        // finally draw
        gl.drawArrays(
            gl.TRIANGLE_STRIP, // type of geometry
            0, // no offset
            4 // 4 vertices
        );

        // queue up our next draw
        this.animTimeout = requestAnimationFrame(this.draw);
    }
}
