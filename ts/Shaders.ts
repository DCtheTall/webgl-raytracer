/*

WebGL Raytracer
---------------

Shaders module:
- contains source for vertex and fragment shaders
- contains function to get shader program from source

*/

/****************************************************/

/*
* SHADER SOURCE CODE
*/

let VERTEX_SHADER: string;
let FRAGMENT_SHADER: string;

/* VERTEX SHADER */

VERTEX_SHADER = `
  attribute vec2 aWindowPosition;

  void main() {
    gl_Position = vec4(aWindowPosition, 1., 1.);
  }
`;

/* FRAGMENT SHADER */

FRAGMENT_SHADER = `
  void main() {
    gl_FragColor = vec4(1., 0., 0., 1.);
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
export default initShaders;
