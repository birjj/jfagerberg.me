// Yoinked from https://al-ro.github.io/projects/shaders/warp/
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main(){
    // rescale our position from pixels to [0,0,1,1]
    vec2 pos = gl_FragCoord.xy / u_resolution.xy;
    // then rescale to make coordinate system square, regardless of if canvas is rectangular
    pos.y /= u_resolution.x / u_resolution.y;

    vec3 col = vec3(0.);
    float strength = 0.4;
    pos = 4.0*(vec2(0.5) - pos);
    
    for(float k = 1.0; k < 7.0; k+=1.0){ 
        pos.x += strength * sin(2.0 * u_time + k*1.5 * pos.y) - 0.2 * u_time;
        pos.y += strength * cos(2.0 * u_time + k*1.5 * pos.x) - 0.2 * u_time;
    }
    
    //Time varying pixel colour
    col += 0.5 + 0.5*cos(pos.xyx+vec3(0,2,4));

    gl_FragColor = vec4(col, 1.0);
}