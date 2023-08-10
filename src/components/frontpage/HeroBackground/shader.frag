precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_offset;
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

/** Picks one of the uniform colors based on a value in the range [-1.0;1.0] */
vec3 pickColor(float val) {
  vec3 c = c1;
  c = mix(c, c2, step(-0.6, val));
  c = mix(c, c3, step(-0.2, val));
  c = mix(c, c4, step(0.2, val));
  c = mix(c, c5, step(0.6, val));
  return c;
}

void main() {
  vec2 normalized_pos = gl_FragCoord.xy / u_resolution;
  normalized_pos.x *= u_resolution.x / u_resolution.y; // remove stretching
  
  float time = u_time / 25000.0;
  vec2 offset = u_offset * vec2(-1.0, 1.0) * 0.25;
  normalized_pos *= 1.0; // make the blobs bigger
  offset *= 0.2;
  // normalized_pos.x += u_offset.x * 0.2;

  float noise = snoise(vec3(normalized_pos, time));

  vec3 c = c1;
  c = mix(c, c2, step(-0.6, snoise(vec3(normalized_pos + offset*1.0, time))));
  c = mix(c, c3, step(-0.2, snoise(vec3(normalized_pos + offset*0.7, time))));
  c = mix(c, c4, step(0.2, snoise(vec3(normalized_pos + offset*0.4, time))));
  c = mix(c, c5, step(0.6, snoise(vec3(normalized_pos + offset*0.1, time))));
  
  gl_FragColor = vec4(c, 1.0);
  return;
}