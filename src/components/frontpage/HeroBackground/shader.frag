precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;

uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform vec3 u_color5;

#pragma glslify: snoise = require("glsl-noise/simplex/3d.glsl")

vec3 c1 = u_color1 / 255.0;
vec3 c2 = u_color2 / 255.0;
vec3 c3 = u_color3 / 255.0;
vec3 c4 = u_color4 / 255.0;
vec3 c5 = u_color5 / 255.0;

/** Gets the noise value at a particular point (potentially manipulated by e.g. mouse position or closeness to edge) */
float getNoise(vec3 point, float distFromMouse) {
  vec2 normalized_pos = point.xy / u_resolution;
  normalized_pos.x *= u_resolution.x / u_resolution.y; // remove stretching
  
  float maxRes = min(u_resolution.x, u_resolution.y);
  float scale = 1.0 - (smoothstep(0.0, maxRes * 1.25, distFromMouse) + pow(smoothstep(0.0, maxRes * 0.67, distFromMouse), 0.25)) / 2.0;

  float n = snoise(vec3(normalized_pos, point.z));
  return (n + 1.0) * scale - 1.0;
}

/** Picks one of the uniform colors based on a value in the range [-1.0;1.0] */
vec3 pickColor(vec2 point, float time) {
  float maxRes = min(u_resolution.x, u_resolution.y);
  float distFromMouse = distance(point.xy, vec2(u_mousepos.x, u_resolution.y - u_mousepos.y));
  if (distFromMouse > maxRes * 1.0) {
    return c1;
  }

  vec3 c = c1;
  float noise = getNoise(vec3(point, time), distFromMouse);
  c = mix(c, c2, step(-0.6, noise));
  c = mix(c, c3, step(-0.2, noise));
  c = mix(c, c4, step(0.2, noise));
  c = mix(c, c5, step(0.6, noise));
  return c;
}

void main() {  
  float time = u_time / 25000.0;
  
  gl_FragColor = vec4(pickColor(gl_FragCoord.xy, time), 1.0);
  return;
}