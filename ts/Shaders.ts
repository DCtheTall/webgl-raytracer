/*

WebGL Raytracer
---------------

Shaders module:
- contains source for vertex and fragment shaders
- contains function to get shader program from source and compiles them
- exports a function which initializes the shaders and returns the shader
  program

*/

/****************************************************/

/*
* SHADER SOURCE CODE
*/

let VERTEX_SHADER: string;
let FRAGMENT_SHADER: string;

/* VERTEX SHADER */

VERTEX_SHADER = `
  precision mediump float;

  attribute vec2 aWindowPosition;
  attribute vec3 aPosition;

  varying vec3 vPosition;

  void main() {
    gl_Position = vec4(aWindowPosition, 1., 1.);
    vPosition = aPosition;
  }
`;

/* FRAGMENT SHADER */

FRAGMENT_SHADER = `
  precision mediump float;

  varying vec3 vPosition;

  uniform vec3 cameraPos;
  uniform int numLights;
  uniform vec3 lightPos[32];
  uniform vec3 lightCol[32];
  uniform float intensities[32];

  /**
  * Intersection test for spheres
  */
  float intersectSphere(vec3 rayStart, vec3 rayDir, vec3 center, float r) {
    vec3 at;
    float v;
    float dist;
    float disc;

    at = center - rayStart;
    v = dot(at, rayDir);
    dist = -1.;
    if( v >= 0. ) {
      disc = r * r - ( dot(at, at) - v * v );
      if( disc > 0. ) dist = v - sqrt(disc);
    }
    return dist;
  }

  /**
  * Color sphere
  */
  vec3 colorSphere(vec3 pos, vec3 viewDir, vec3 diffColor, vec3 specColor) {
    vec3 color = vec3(0.);
    for ( int i = 0; i < 32; i++ ) {
      if( i > numLights ) continue;

      vec3 currPos;
      vec3 currColor;
      float intensity;
      vec3 lightDir;
      float distance;
      float lambertian;
      vec3 H;
      float specular;

      currPos = lightPos[i];
      currColor = lightCol[i];
      intensity = intensities[i];

      lightDir = normalize(currPos - pos);
      distance = length(currPos - pos);

      lambertian = intensity * clamp( dot(normalize(pos), lightDir), 0.2, 1. ) / distance;

      H = normalize(reflect(lightDir, pos) + viewDir);
      specular = intensity * clamp( pow(dot(normalize(pos), H), 50.), 0.01, 1.) / distance / distance;

      color += (lambertian * diffColor + specular * specColor) * currColor;

    }

    return color;
  }


  /**
  * main function
  */
  void main() {
    vec3 cameraDir;
    float dist;
    vec3 color;

    cameraDir = normalize(vPosition - cameraPos);
    dist = intersectSphere(cameraPos, cameraDir, vec3(0.), 0.5);

    if( dist > 0. ) {
      vec3 pos = cameraPos + dist * cameraDir;
      color = colorSphere( pos, -1.*cameraDir, vec3(0.1, 0.5, 1.), vec3(0.9) );
      gl_FragColor = vec4(color, 1.);
    }
    else {
      gl_FragColor = vec4(0., 0., 0., 1.);
    }
  }
`;

/****************************************************/

/*
* This function loads the shader from the source code
*/
function getShader( gl: WebGLRenderingContext,
                    source: string,
                    vertexOrFragment: boolean ): WebGLShader
{
  let shader: WebGLShader;

  shader = vertexOrFragment?
    gl.createShader(gl.VERTEX_SHADER) : gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader failed to compile: '+ gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

/****************************************************/

/*
* Shader module contains shader source and methods to compile/attach shaders
*
* @function initShaders
*/
function initShaders(gl: WebGLRenderingContext): WebGLProgram {
  let vertexShader: WebGLShader;
  let fragmentShader: WebGLShader;
  let shaderProgram: WebGLProgram;

  vertexShader = getShader(gl, VERTEX_SHADER, true);
  fragmentShader = getShader(gl, FRAGMENT_SHADER, false);
  if(vertexShader === null || fragmentShader === null) {
    console.log("Shader failed to compile. See error message for details.");
    return null;
  }

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if( !gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) ) {
    console.error("Could not initialize shader program.");
    return null;
  }
  gl.useProgram(shaderProgram);

  return shaderProgram;
}

/************************************************************************/

// Export initShaders from this program

export default initShaders;
