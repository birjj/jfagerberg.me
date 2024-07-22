precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mousepos;

uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform vec3 u_color5;

// below is glsl-noise/simplex/3d -- see end of file for our own code
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

/** Returns a noise value in the range [-1.0,1.0] */
float snoise(vec3 v)
  {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }

/* ============ */

/** Easing, x in [0.0,1.0], out [0.0,1.0] -- easeInOutSine https://easings.net/#easeInOutSine */
#ifndef PI
#define PI 3.141592653589793
#endif
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif
float easeInOutSine(float x) {
  x = clamp(x, 0.0, 1.0);
  return sin((x - 1.0) * HALF_PI) + 1.0;
}

/** Edges contribute a value in the range [0.0,1.0]. This calculates it in a nice inner-shadow like way */
float getEdgeValue(vec2 point) {
  const float edgeOffsetLimit = 0.1; // add offsets if within 10% of border
  const float edgePower = 0.5;
  float distToEdgeX = clamp(min(point.x, u_resolution.x - point.x) / (u_resolution.x * edgeOffsetLimit), 0.0, 2.0);
  float distToEdgeY = clamp(min(point.y, u_resolution.y - point.y) / (u_resolution.y * edgeOffsetLimit), 0.0, 2.0);
  return clamp(0.5 - pow(distToEdgeX, edgePower) * pow(distToEdgeY, edgePower), 0.0, 1.0);
}

/** The mouse contributes a value in the range [0.0,1.0]. This calculates it */
float getMouseValue(vec2 point) {
  float distFromMouse = distance(point.xy, vec2(u_mousepos.x, u_resolution.y - u_mousepos.y));
  float maxRes = min(u_resolution.x, u_resolution.y);
  float scale = 1.0 - (smoothstep(0.0, maxRes * 1.25, distFromMouse) + pow(smoothstep(0.0, maxRes * 0.67, distFromMouse), 0.25)) / 2.0;
  return scale;
}

/** Combines two distance values in the range [0.0,1.0] in a metaball-like effect */
float combineValues(float distA, float distB) {
  return distA * distB;
}

/** Returns the color for the given noise value in range [0.0,1.0] */
vec3 classifyColor(float value) {
  vec3 c1 = u_color1 / 255.0;
  vec3 c2 = u_color2 / 255.0;
  vec3 c3 = u_color3 / 255.0;
  vec3 c4 = u_color4 / 255.0;
  vec3 c5 = u_color5 / 255.0;

  vec3 c = c1;
  c = mix(c, c2, step(0.2, value));
  c = mix(c, c3, step(0.4, value));
  c = mix(c, c4, step(0.6, value));
  c = mix(c, c5, step(0.8, value));
  return c;
}

/** Gets a noise value in range [0.0,1.0] for the given screen coordinate  */
float getNoise(vec2 point) {
  float time = u_time / 25000.0;
  vec2 normalized_pos = point.xy / u_resolution;
  normalized_pos.x *= u_resolution.x / u_resolution.y; // remove stretching

  return (snoise(vec3(normalized_pos, time)) + 1.0) / 2.0;
}

void main() {  
  float noise = getNoise(gl_FragCoord.xy);
  float mouseScaling = getMouseValue(gl_FragCoord.xy);
  float edgeScaling = getEdgeValue(gl_FragCoord.xy) * mouseScaling;
  float scaling = mouseScaling + pow(edgeScaling, 2.0);
  vec3 color = classifyColor(noise * scaling);
  gl_FragColor = vec4(color, 1.0);
  return;
}