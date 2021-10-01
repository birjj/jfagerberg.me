/** An object representing the uniforms to pass to the shaders */
export type WebGLUniforms = {
    [k: string]: number | [number, number];
};

/** Must be consistent (i.e. not change number or names of returned uniforms when recalled) */
export type WebGLUniformsGetter = (gl?: WebGLRenderingContext) => WebGLUniforms;
