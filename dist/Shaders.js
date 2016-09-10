"use strict";
var VERTEX_SHADER;
var FRAGMENT_SHADER;
VERTEX_SHADER = "\n  attribute vec2 aWindowPosition;\n\n  void main() {\n    gl_Position = vec4(aWindowPosition, 1., 1.);\n  }\n";
FRAGMENT_SHADER = "\n  void main() {\n    gl_FragColor = vec4(1., 0., 0., 1.);\n  }\n";
function getShader(gl, source, vertexOrFragment) {
    var shader;
    shader = vertexOrFragment ?
        gl.createShader(gl.VERTEX_SHADER) : gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader failed to compile: ' + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}
function initShaders(gl) {
    var vertexShader;
    var fragmentShader;
    var shaderProgram;
    vertexShader = getShader(gl, VERTEX_SHADER, true);
    fragmentShader = getShader(gl, FRAGMENT_SHADER, false);
    if (vertexShader === null || fragmentShader === null) {
        console.log("Shader failed to compile. See error message for details.");
        return null;
    }
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Could not initialize shader program.");
        return null;
    }
    gl.useProgram(shaderProgram);
    return shaderProgram;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initShaders;
//# sourceMappingURL=Shaders.js.map