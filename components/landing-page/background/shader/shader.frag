// Yoinked from https://al-ro.github.io/projects/shaders/warp/
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_scroll;

const float LIQUID_SCALE = 2.5;

// generate the color at the given position for the liquid layer
vec3 c_liquid() {
    vec3 col = vec3(0.);
    float strength = 0.4;
    float t = u_time / 100.0;

    vec2 coord = vec2(gl_FragCoord.x, gl_FragCoord.y - u_scroll * 0.25);

    for(int i = -1; i <= 1; i++) {
        for(int j = -1; j <= 1; j++) {
            // use the normalized resolution-independent fragcoord
            vec2 pos = coord + vec2(i,j) / 3.0;
            pos /= u_resolution.xy;
            pos.y /= u_resolution.x / u_resolution.y;

            // and scale it by our LIQUID_SCALE
            pos *= LIQUID_SCALE;
        
            // then add up all our components
            for(float k = 1.0; k < 7.0; k+=1.0){ 
                pos.x += strength * sin(2.0 * t + k*1.5 * pos.y) - 0.2 * t;
                pos.y += strength * cos(2.0 * t + k*1.5 * pos.x) - 0.2 * t;
            }

            // time varying pixel colour
            col += 0.5 + 0.5*cos(pos.xyx + vec3(0,2,4));
        }
    }
    col /= 9.0;
    
    return col;
}

// generate a mask based on scroll position
// returns a signed distance field (negative if inside shape, positive otherwise)
float sdf_mask() {
    float y = gl_FragCoord.y - u_scroll;

    float t = u_time * 0.05 + 50.0;
    float left = sin(t * 0.5 + y * 0.008) * 0.3
        + cos(t * 1.2 + y * 0.0065) * 0.3
        + sin(t * 1.67 + y * 0.007) * 0.4;
    float right = cos(0.5 + t * 0.5 + y * 0.003) * 0.3
        + sin(10. + t * 1.2 + y * 0.005) * 0.3
        + sin(5. + t * 1.67 + y * 0.006) * 0.4;
    float scale = 64.;
    return max(
        scale + left * scale - gl_FragCoord.x,
        gl_FragCoord.x - (u_resolution.x - right * scale - scale) 
    );
}

void main(){
    vec3 col = c_liquid();

    float mask = sdf_mask();
    float alpha = 1.0 - smoothstep(-1.0, 1.0, mask);

    gl_FragColor = vec4(col, alpha);
}