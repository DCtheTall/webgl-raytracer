"use strict";
var VERTEX_SHADER;
var FRAGMENT_SHADER;
VERTEX_SHADER = "\n  precision mediump float;\n\n  attribute vec2 aWindowPosition;\n  attribute vec3 aPosition;\n\n  varying vec3 vPosition;\n\n  void main() {\n    gl_Position = vec4(aWindowPosition, 1., 1.);\n    vPosition = aPosition;\n  }\n";
FRAGMENT_SHADER = "\n  precision mediump float;\n\n  varying vec3 vPosition;\n\n  uniform vec3 cameraPos;\n  uniform int numLights;\n  uniform vec3 lightPos[32];\n  uniform vec3 lightCol[32];\n  uniform float intensities[32];\n\n  /**\n  * Intersection test for spheres\n  */\n  float intersectSphere(vec3 rayStart, vec3 rayDir, vec3 center, float r) {\n    vec3 at;\n    float v;\n    float dist;\n    float disc;\n\n    at = center - rayStart;\n    v = dot(at, rayDir);\n    dist = -1.;\n    if( v >= 0. ) {\n      disc = r * r - ( dot(at, at) - v * v );\n      if( disc > 0. ) dist = v - sqrt(disc);\n    }\n    return dist;\n  }\n\n  /**\n  * Color sphere\n  */\n  vec3 colorSphere(vec3 pos, vec3 viewDir, vec3 diffColor, vec3 specColor) {\n    vec3 color = vec3(0.);\n    for ( int i = 0; i < 32; i++ ) {\n      if( i > numLights ) continue;\n\n      vec3 currPos;\n      vec3 currColor;\n      float intensity;\n      vec3 lightDir;\n      float distance;\n      float lambertian;\n      vec3 H;\n      float specular;\n\n      currPos = lightPos[i];\n      currColor = lightCol[i];\n      intensity = intensities[i];\n\n      lightDir = normalize(currPos - pos);\n      distance = length(currPos - pos);\n\n      lambertian = intensity * clamp( dot(normalize(pos), lightDir), 0.2, 1. ) / distance;\n\n      H = normalize(reflect(lightDir, pos) + viewDir);\n      specular = intensity * clamp( pow(dot(normalize(pos), H), 50.), 0.01, 1.) / distance / distance;\n\n      color += (lambertian * diffColor + specular * specColor) * currColor;\n\n    }\n\n    return color;\n  }\n\n\n  /**\n  * main function\n  */\n  void main() {\n    vec3 cameraDir;\n    float dist;\n    vec3 color;\n\n    cameraDir = normalize(vPosition - cameraPos);\n    dist = intersectSphere(cameraPos, cameraDir, vec3(0.), 0.5);\n\n    if( dist > 0. ) {\n      vec3 pos = cameraPos + dist * cameraDir;\n      color = colorSphere( pos, -1.*cameraDir, vec3(0.1, 0.5, 1.), vec3(0.9) );\n      gl_FragColor = vec4(color, 1.);\n    }\n    else {\n      gl_FragColor = vec4(0., 0., 0., 1.);\n    }\n  }\n";
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