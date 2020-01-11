precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;
uniform vec2 u_offset;

#pragma glslify: snoise = require("glsl-noise/simplex/3d")

vec3 c1 = vec3(30, 30, 35) / 255.0;
vec3 c2 = vec3(34, 34, 39) / 255.0;
vec3 c3 = vec3(36, 36, 42) / 255.0;
vec3 c4 = vec3(40, 40, 45) / 255.0;
vec3 c5 = vec3(43, 43, 48) / 255.0;
void main() {
    vec2 normalized_pos = gl_FragCoord.xy / u_resolution;
    normalized_pos.x *= u_resolution.x / u_resolution.y; // remove stretching
    float time = u_time / 75000.0;
    vec2 offset = vec2(0, (u_offset.y - 0.5) * 3.0);
    offset.x *= u_resolution.x / u_resolution.y;
    normalized_pos *= 0.6; // make the blobs bigger
    offset *= -0.5;
    normalized_pos.x += u_offset.x * 0.2;

    // TODO: replace with a single lookup texture so we don't compute noise 5 times
    float c5scale = 1.0 - step(0.6, snoise(vec3(normalized_pos + offset * 0.4, time)));
    float c4scale = 1.0 - step(0.2, snoise(vec3(normalized_pos + offset * 0.3, time))) - c5scale;
    float c3scale = 1.0 - step(-0.2, snoise(vec3(normalized_pos + offset * 0.2, time))) - c4scale - c5scale;
    float c2scale = 1.0 - step(-0.6, snoise(vec3(normalized_pos + offset * 0.1, time))) - c3scale - c4scale - c5scale;
    float c1scale = 1.0 - c2scale - c3scale - c4scale - c5scale;
    gl_FragColor = vec4(c1 * c1scale + c2 * c2scale + c3 * c3scale + c4 * c4scale + c5 * c5scale, 1.0);
    return;
}