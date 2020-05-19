import ShaderProgram from "./background/shader-program";
import EasedVec2 from "./background/eased-vector";
import vertShader from "./background/shaders/background.vert";
import fragShader from "./background/shaders/background.frag";
import type { WebGLUniforms } from "./background/shader-program";

// calculate the background offset based on scroll and URL
const easedOffset = new EasedVec2(0, 0, 200); // x = url level, y = scroll position range [0,1]
const updateScrollOffset = () => {
    easedOffset.setY(
        window.scrollY / (document.body.offsetHeight - window.innerHeight)
    );
};
// TODO: update on URL change
window.addEventListener("scroll", updateScrollOffset);
window.addEventListener("resize", updateScrollOffset);

/** Gets the uniforms we use for the shader */
const uniforms: WebGLUniforms = {}; // we reuse a single object to avoid memory pollution
function getUniforms(gl: WebGLRenderingContext): WebGLUniforms {
    uniforms.u_offset = easedOffset.vec;
    return uniforms;
}

// create our canvas and insert it into the DOM
(function ($parent: HTMLElement) {
    const $canvas = document.createElement("canvas");
    $canvas.id = "webgl-bg";
    const ctx = $canvas.getContext("webgl");
    if (!ctx) {
        return console.warn("Does not support WebGL");
    }

    // create our shader program that handles drawing the background
    const program = new ShaderProgram(
        $canvas.getContext("webgl") as WebGLRenderingContext,
        vertShader,
        fragShader,
        getUniforms
    );
    program.draw();

    // insert our canvas into DOM (and keep its size updated)
    const resizeCanvas = () => {
        $canvas.width = window.innerWidth;
        $canvas.height = window.innerHeight;
        ctx.viewport(0, 0, $canvas.width, $canvas.height);
        ctx.clear(ctx.COLOR_BUFFER_BIT);
        program.draw();
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    $parent.insertBefore($canvas, $parent.firstChild);
})(document.body);
