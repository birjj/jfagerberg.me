import shader from "./shader.frag";

const DEFAULT_VERTEX_SHADER = `#ifdef GL_ES
precision mediump float;
#endif
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export type WebGLUniform =
  | number
  | boolean
  | [number, number]
  | [number, number, number];
export type WebGLUniforms = { [k: string]: WebGLUniform | undefined };
type ParsedUniform = { location: WebGLUniformLocation | null } & (
  | {
      value: boolean;
      method: "uniform1i";
    }
  | {
      value: number;
      method: "uniform1f";
    }
  | {
      value: [number, number];
      method: "uniform2f";
    }
  | {
      value: [number, number, number];
      method: "uniform3f";
    }
);

export default class WebGLHandler {
  uniformsGetter: (prev: WebGLUniforms) => WebGLUniforms;
  uniforms: { [k: string]: ParsedUniform } = {};
  ctx!: WebGLRenderingContext;
  program!: WebGLProgram;

  pixelRatio = devicePixelRatio || 1;
  paused = false;
  animationRequest = 0;

  constructor(
    canvas: HTMLCanvasElement,
    fragment: string,
    uniformsGetter: (prev: WebGLUniforms) => WebGLUniforms = () => ({})
  ) {
    this.uniformsGetter = uniformsGetter;

    this.setCanvas(canvas);
    this.setShader(fragment);

    const vertAttribLoc = this.ctx.getAttribLocation(
      this.program,
      "a_position"
    );
    const vertBuffer = this.ctx.createBuffer();
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, vertBuffer);
    this.ctx.bufferData(
      this.ctx.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
      ]),
      this.ctx.STATIC_DRAW
    );
    this.ctx.enableVertexAttribArray(vertAttribLoc);
    this.ctx.vertexAttribPointer(vertAttribLoc, 2, this.ctx.FLOAT, false, 0, 0);

    this.render();
  }

  setCanvas(
    canvas: HTMLCanvasElement,
    options: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true }
  ) {
    this.ctx =
      canvas.getContext("webgl", options) ||
      (canvas.getContext(
        "experimental-webgl",
        options
      ) as WebGLRenderingContext);
    if (!this.ctx) {
      throw new Error("WebGL is unsupported");
    }
  }

  setShader(fragment: string, vertex = DEFAULT_VERTEX_SHADER) {
    if (this.program) {
      this.ctx.deleteProgram(this.program);
    }
    const vert = this.createShader(this.ctx.VERTEX_SHADER, vertex);
    const frag = this.createShader(this.ctx.FRAGMENT_SHADER, fragment);
    this.program = this.createProgram(frag, vert);
    this.ctx.useProgram(this.program);
    this.ctx.deleteShader(vert);
    this.ctx.deleteShader(frag);
    this.render();
  }

  setPause(value: boolean) {
    if (!value) {
      cancelAnimationFrame(this.animationRequest);
    } else {
      this.render();
    }
    this.paused = value;
  }

  render() {
    this.ctx.viewport(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.useProgram(this.program);
    this.updateUniforms();
    this.ctx.drawArrays(this.ctx.TRIANGLES, 0, 6);

    if (!this.paused) {
      this.animationRequest = requestAnimationFrame(() => this.render());
    }
  }

  setUniformsGetter(func: (prev: WebGLUniforms) => WebGLUniforms = () => ({})) {
    this.uniformsGetter = func;
    this.uniforms = {};
  }

  destroy() {
    if (this.program) {
      this.ctx.deleteProgram(this.program);
    }
    this.uniforms = {};
    this.setPause(true);
  }

  private updateUniforms() {
    // ask the provider for uniform values
    const prev: WebGLUniforms = {};
    Object.keys(this.uniforms).forEach((k) => {
      prev[k] = this.uniforms[k].value;
    });
    const next = this.uniformsGetter(prev);

    // update each uniform, also setting its location if we don't know it yet
    Object.keys(next).forEach((k) => {
      const value = next[k];
      if (!value) {
        return;
      }
      const uniform = this.uniforms[k] || parseUniform(value);
      uniform.value = value;
      // get the location if we don't have it already
      if (!uniform.location) {
        this.ctx.useProgram(this.program);
        uniform.location = this.ctx.getUniformLocation(this.program, k)!;
        if (!uniform.location) {
          console.error("Cannot get uniform location for", k);
          return;
        }
      }
      // update the value if it changed since last time
      if (isDifferent(prev[k], value)) {
        if (!Array.isArray(uniform.value)) {
          // @ts-ignore
          this.ctx[uniform.method](uniform.location, +uniform.value);
        } else {
          // @ts-ignore
          this.ctx[uniform.method](uniform.location, ...uniform.value);
        }
      }
      this.uniforms[k] = uniform;
    });
  }

  private createShader(
    type:
      | WebGLRenderingContextBase["VERTEX_SHADER"]
      | WebGLRenderingContextBase["FRAGMENT_SHADER"],
    source: string
  ) {
    const shader = this.ctx.createShader(type);
    if (!shader) {
      throw new Error("Failed to create shader");
    }
    this.ctx.shaderSource(shader, source);
    this.ctx.compileShader(shader);
    const success = this.ctx.getShaderParameter(
      shader,
      this.ctx.COMPILE_STATUS
    );
    if (!success) {
      const err = `Error while compiling shader: ${this.ctx.getShaderInfoLog(
        shader
      )}`;
      this.ctx.deleteShader(shader);
      throw new Error(err);
    }
    return shader;
  }

  private createProgram(fragment: WebGLShader, vertex: WebGLShader) {
    const program = this.ctx.createProgram();
    if (!program) {
      throw new Error("Failed to create program");
    }
    this.ctx.attachShader(program, fragment);
    this.ctx.attachShader(program, vertex);
    this.ctx.linkProgram(program);

    const success = this.ctx.getProgramParameter(program, this.ctx.LINK_STATUS);
    if (!success) {
      const err = `Error while linking program: ${this.ctx.getProgramInfoLog(
        program
      )}`;
      this.ctx.deleteProgram(program);
      throw new Error(err);
    }
    return program;
  }
}

const parseUniform = (value: WebGLUniform): ParsedUniform => {
  let method: ParsedUniform["method"];
  switch (typeof value) {
    case "number":
      method = "uniform1f";
      break;
    case "boolean":
      method = "uniform1i";
      break;
    default:
      if (Array.isArray(value)) {
        method = `uniform${value.length}f` as any;
        break;
      }
      throw new Error(`Unknown uniform type: ${value}`);
  }
  return {
    location: null,
    method,
    value,
  } as ParsedUniform;
};

const isDifferent = (
  a: WebGLUniform | undefined,
  b: WebGLUniform | undefined
): boolean => {
  if (a === b) {
    return false;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.some((v, i) => v !== b[i]);
  }
  return true;
};
