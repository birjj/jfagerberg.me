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

    for(int i = -1; i <= 1; i++) {
        for(int j = -1; j <= 1; j++) {
            // use the normalized resolution-independent fragcoord
            vec2 pos = gl_FragCoord.xy - vec2(0, u_scroll * 0.25) + vec2(i,j) / 3.0;
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
float m_liquid_mask() {
    float y = (gl_FragCoord.y - u_scroll) / u_resolution.y;
    y /= u_resolution.x / u_resolution.y;

    float t = u_time * 0.05 + 50.0;
    float left = sin(t * 0.5 + y * 8.5) * 0.3
        + cos(t * 1.2 + y * 6.5) * 0.3
        + sin(t * 1.67 + y * 7.) * 0.4;
    float right = cos(0.5 + t * 0.5 + y * 3.) * 0.3
        + sin(10. + t * 1.2 + y * 5.) * 0.3
        + sin(5. + t * 1.67 + y * 6.) * 0.4;
    float scale = 0.125;
    float a = scale + left * scale;
    float b = 1. - scale + right * scale;
    float pixel_size = 1.0 / u_resolution.x;

    return min(
        smoothstep(a - 1.0 * pixel_size, a + 1.0 * pixel_size, gl_FragCoord.x / u_resolution.x),
        1. - smoothstep(b - pixel_size, b + pixel_size, gl_FragCoord.x / u_resolution.x)
    );
}

void main(){
    // rescale our position from pixels to [0,0,1,1]
    vec2 pos = gl_FragCoord.xy / u_resolution.xy;
    // then rescale to make coordinate system square, regardless of if canvas is rectangular
    pos.y /= u_resolution.x / u_resolution.y;

    vec3 col = c_liquid();

    gl_FragColor = vec4(col, m_liquid_mask());
}