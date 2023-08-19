export type WebGLUniforms = Record<
  string,
  number | [number, number] | [number, number, number]
>;

/** Must be consistent (i.e. not change number of returned uniforms when recalled) */
export type WebGLUniformsGetter = (gl: WebGLRenderingContext) => WebGLUniforms;

/**
 * Runs a WebGL shader on the given canvas
 * Shaders are given the uniforms returned by `uniformsGetter`
 * Also given:
 *   attribute a_position:      the current pixel
 *   uniform float u_time:      the current timestamp
 *   uniform vec2 u_resolution: the size of the canvas
 */
export default class AnimatedShaderCanvas {
  gl: WebGLRenderingContext;
  vertex: WebGLShader;
  fragment: WebGLShader;
  program: WebGLProgram;

  uniformsGetter: WebGLUniformsGetter;
  uniforms: WebGLUniforms;
  locations: { [k: string]: number | WebGLUniformLocation };
  positionBuffer: WebGLBuffer;

  startTime: number;
  paused: boolean = false;
  private animationTimeout?: number;

  constructor(
    gl: WebGLRenderingContext,
    vertex: string,
    fragment: string,
    uniformsGetter: WebGLUniformsGetter
  ) {
    this.gl = gl;
    this.startTime = Date.now() - 6000;

    // generate the shaders
    this.vertex = this.createShader(vertex, gl.VERTEX_SHADER);
    this.fragment = this.createShader(fragment, gl.FRAGMENT_SHADER);

    // generate the program
    this.program = this.createProgram(this.vertex, this.fragment);

    // grab where we store the GLSL variables
    this.uniformsGetter = uniformsGetter;
    this.uniforms = this.getUniforms();
    this.locations = {
      a_position: gl.getAttribLocation(this.program, "a_position"),
    };
    Object.keys(this.uniforms).forEach((key) => {
      const location = gl.getUniformLocation(this.program, key);
      if (location) {
        this.locations[key] = location;
      }
    });

    // create the plane we will draw onto
    this.positionBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    const positions = [-1, 1, 1, 1, -1, -1, 1, -1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  }

  /** Gets the uniforms, including our default ones */
  getUniforms = (): WebGLUniforms => {
    return {
      u_time: Date.now() - this.startTime,
      u_resolution: [this.gl.canvas.width, this.gl.canvas.height],
      ...this.uniformsGetter(this.gl),
    };
  };

  /** Creates a program object from two shaders */
  createProgram = (vertex: WebGLShader, fragment: WebGLShader) => {
    const gl = this.gl;
    const program = gl.createProgram();
    if (!program) {
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
  };

  /** Creates a shader object from some source code */
  createShader = (source: string, type: number) => {
    const gl = this.gl;
    const shader = gl.createShader(type);
    if (!shader) {
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
  };

  /** Set whether we are paused */
  setPaused = (paused: boolean) => {
    if (paused === this.paused) {
      return;
    }
    this.paused = paused;
    this.draw();
  };

  /** Actually draws; executes itself after it has first been called */
  draw = (t?: number) => {
    if (this.animationTimeout !== undefined) {
      cancelAnimationFrame(this.animationTimeout);
    }
    if (this.paused) {
      return;
    }

    const gl = this.gl;

    // clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // tell webgl to use the program, and allow the position attribute
    gl.useProgram(this.program);
    gl.enableVertexAttribArray(this.locations.a_position as number);

    // bind this.positionBuffer to ARRAY_BUFFER as points
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(
      this.locations.a_position as number, // variable to bind into
      2, // number of values to pull per point
      gl.FLOAT, // type of values to pull
      false, // no effect, since type = FLOAT
      0, // figure out stride from above values
      0 // no offset before values
    );

    // set our uniforms
    this.uniforms = this.getUniforms();
    Object.keys(this.uniforms).forEach((key) => {
      if (!this.locations[key]) {
        return;
      }
      const value = this.uniforms[key];
      if (typeof value === "number") {
        gl.uniform1f(this.locations[key], value);
      } else if (value instanceof Array && value.length === 2) {
        gl.uniform2f(this.locations[key], value[0], value[1]);
      } else if (value instanceof Array && value.length === 3) {
        gl.uniform3f(this.locations[key], value[0], value[1], value[2]);
      }
    });

    // finally draw
    console.time("Draw");
    gl.drawArrays(
      gl.TRIANGLE_STRIP, // type of geometry
      0, // no offset
      4 // 4 vertices
    );
    console.timeEnd("Draw");

    // and call ourselves again
    this.animationTimeout = requestAnimationFrame(this.draw);
  };
}
