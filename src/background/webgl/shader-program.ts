import EasedVec2 from "../eased-vector";

const mousePos = new EasedVec2(0, 0);
/*
document.body.addEventListener("mousemove", e => {
  mousePos.set(e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2);
});*/
const scrollPos = new EasedVec2(0, 0, 150);
if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
        scrollPos.set(0, window.scrollY);
    });
}
const startTime = Date.now() - 6000;

export interface WebGLUniforms {
    [k: string]: number | [number, number];
}

/**
 * Provides attributes that are given to all shaders
 * These are:
 *   attribute vec* a_position: the position of the current pixel
 *   uniform float u_time: time since rendering started, in ms
 *   uniform vec2 u_resolution: the current canvas resolution
 *   uniform float u_scroll: scroll position as percentage of total [0,1]
 *   uniform vec2 u_mousepos: mouse position on page
 */
function getDefaultUniforms(gl: WebGLRenderingContext) {
    return {
        u_time: Date.now() - startTime,
        u_resolution: [gl.canvas.width, gl.canvas.height] as [number, number],
        u_scroll:
            scrollPos.vec[1] /
            (document.body.offsetHeight - window.innerHeight),
        u_mousepos: [mousePos.vec[0], mousePos.vec[1]] as [number, number],
    };
}

/**
 * Runs a WebGL shader
 * Shaders are given the uniforms returned by `getDefaultUniforms` and `uniformsGetter`
 * Also given the attribute a_position, which is the current pixel
 */
export default class ShaderProgram {
    gl: WebGLRenderingContext;
    vertex: WebGLShader;
    fragment: WebGLShader;
    program: WebGLProgram;

    uniformsGetter: (gl: WebGLRenderingContext) => WebGLUniforms;
    uniforms: WebGLUniforms;
    positions: { [k: string]: number | WebGLUniformLocation };
    positionBuffer: WebGLBuffer;

    startTime: number;
    paused: boolean;
    awaitingDraw = false;
    fps = 0;
    slowFrames = 0;
    _oldT = 0;

    constructor(
        gl: WebGLRenderingContext,
        vertex: string,
        fragment: string,
        uniformsGetter: (gl: WebGLRenderingContext) => WebGLUniforms
    ) {
        this.gl = gl;

        this.startTime = startTime;
        this.paused = false;

        // generate the shaders
        this.vertex = this.createShader(vertex, gl.VERTEX_SHADER);
        this.fragment = this.createShader(fragment, gl.FRAGMENT_SHADER);

        // generate the program
        this.program = this.createProgram(this.vertex, this.fragment);

        // grab where we store the GLSL variables
        this.uniformsGetter = uniformsGetter;
        this.uniforms = {
            ...getDefaultUniforms(gl),
            ...uniformsGetter(gl),
        };
        this.positions = {
            a_position: gl.getAttribLocation(this.program, "a_position"),
        };
        Object.keys(this.uniforms).forEach(key => {
            const location = gl.getUniformLocation(this.program, key);
            if (location) {
                this.positions[key] = location;
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
    }

    /** Creates a program object from two shaders */
    createProgram(vertex: WebGLShader, fragment: WebGLShader) {
        const gl = this.gl;
        const program = gl.createProgram();
        if (!program) {
            throw new Error(`Couldn't create WebGL program`);
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
        const shader = gl.createShader(type);
        if (!shader) {
            throw new SyntaxError(`Couldn't compile shader`);
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
    setPaused(value: boolean) {
        const shouldStartDrawing = !value && value !== this.paused;
        this.paused = value;
        if (shouldStartDrawing) {
            this.draw();
        }
    }

    /* Actually draws; executes itself after it has been first called */
    draw(t?: number) {
        if (this.awaitingDraw) {
            console.warn("[bg] Drawing too often, ignoring");
            return;
        }

        if (this.paused) {
            console.warn("[bg] Stopping automatic draw due to pausing");
            return;
        }

        // calculate fps
        if (t !== undefined) {
            this.fps = 1000 / (t - this._oldT);
            if (isNaN(this.fps)) {
                this.fps = 0;
            }
            this._oldT = t;
        }

        // make sure we aren't animating super laggy backgrounds
        if (this.fps && this.fps < 30) {
            this.slowFrames = (this.slowFrames || 0) + 1;
        } else if (this.slowFrames > 0) {
            --this.slowFrames;
        }

        const gl = this.gl;
        // clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // tell webgl to use the program, and allow the position attribute
        gl.useProgram(this.program);
        gl.enableVertexAttribArray(this.positions.a_position as number);
        // bind this.positionBuffer to ARRAY_BUFFER as points
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(
            this.positions.a_position as number, // variable to bind into
            2, // number of values to pull per point
            gl.FLOAT, // type of values to pull
            false, // no effect anyway, since type = FLOAT
            0, // figure out stride from above values
            0 // no offset before values
        );

        // also set our uniforms
        this.uniforms = {
            ...getDefaultUniforms(gl),
            ...this.uniformsGetter(gl),
        };
        Object.keys(this.uniforms).forEach(key => {
            if (!this.positions[key]) {
                return;
            }
            const value = this.uniforms[key];
            if (typeof value === "number") {
                gl.uniform1f(this.positions[key], value);
            } else if (value instanceof Array) {
                gl.uniform2f(this.positions[key], value[0], value[1]);
            }
        });

        gl.drawArrays(
            gl.TRIANGLE_STRIP, // the type of geometry
            0, // no offset
            4 // 4 vertexes
        );

        // draw again in a bit
        if (this.awaitingDraw) {
            return;
        } // unless we've already queued a draw
        if (this.slowFrames > 30) {
            console.warn("[bg] Slow rendering", this.slowFrames);
            // return;
        } // or the computer is too slow to render repeatedly
        this.awaitingDraw = true;

        requestAnimationFrame(t => {
            this.awaitingDraw = false;
            this.draw(t);
        });
    }
}
