"use strict";
var VERTEX_SHADER;
var FRAGMENT_SHADER;
VERTEX_SHADER = "\n  precision mediump float;\n\n  attribute vec2 aWindowPosition;\n  attribute vec3 aPosition;\n\n  varying vec3 vPosition;\n\n  void main() {\n    gl_Position = vec4(aWindowPosition, 1., 1.);\n    vPosition = aPosition;\n  }\n";
FRAGMENT_SHADER = "\n  precision mediump float;\n\n  varying vec3 vPosition;\n\n  uniform vec3 cameraPos;\n  uniform int numLights;\n  uniform vec3 lightPos[32];\n  uniform vec3 lightCol[32];\n  uniform float intensities[32];\n  uniform int numSpheres;\n  uniform vec3 spherePos[32];\n  uniform float sphereRadius[32];\n  uniform vec3 sphereDiff[32];\n  uniform vec3 sphereSpec[32];\n  uniform float sphereRoughness[32];\n\n  /**\n  * Intersection test for spheres\n  */\n  float intersectSphere(vec3 rayStart, vec3 rayDir, vec3 center, float r) {\n    vec3 at;\n    float v;\n    float dist;\n    float disc;\n\n    at = center - rayStart;\n    v = dot(at, rayDir);\n    dist = -1.;\n    if( v >= 0. ) {\n      disc = r * r - ( dot(at, at) - v * v );\n      if( disc > 0. ) dist = v - sqrt(disc);\n    }\n    return dist;\n  }\n\n  /**\n  * Color fragment using Blinn-Phong global illumination model\n  */\n  vec3 getNaturalColor( vec3 pos,\n                        vec3 normal,\n                        vec3 viewDir,\n                        vec3 diffColor,\n                        vec3 specColor,\n                        float roughness )\n  {\n    vec3 color = vec3(0.);\n    for ( int i = 0; i < 32; i++ ) {\n      if( i > numLights ) continue;\n\n      vec3 currPos;\n      vec3 currColor;\n      float intensity;\n      vec3 lightDir;\n      float distance;\n      float lambertian;\n      vec3 H;\n      float specular;\n\n      lightDir = normalize(lightPos[i] - pos);\n      distance = length(lightPos[i] - pos);\n\n      lambertian = intensities[i] * clamp( dot(normal, lightDir), 0.2, 1. ) / distance;\n\n      H = normalize(reflect(lightDir, pos) + viewDir);\n      specular = intensities[i] * clamp( pow(dot(normal, H), 50.), 0.01, 1.) / distance / distance;\n\n      color += (lambertian * diffColor + specular * specColor) * lightCol[i];\n    }\n    return color;\n  }\n\n  /**\n  * Intersection test for the world\n  * returns a color vector\n  */\n  vec3 intersectWorld(vec3 rayStart, vec3 rayDir) {\n    vec3 color;\n    float closestDist;\n\n    color = vec3(0.);\n    closestDist = 100000.;\n\n    for( int i = 0; i < 32; i++ ) {\n      if( i > numSpheres ) continue;\n\n      float dist;\n      dist = intersectSphere(rayStart, rayDir, spherePos[i], sphereRadius[i]);\n\n      if( dist > 0. && dist < closestDist ) {\n        vec3 pos;\n        vec3 normal;\n        pos = dist * rayDir + rayStart;\n        normal = normalize(pos - spherePos[i]);\n        color = getNaturalColor(pos, normal, -rayDir, sphereDiff[i], sphereSpec[i], sphereRoughness[i]);\n        closestDist = dist;\n      }\n    }\n\n    return color;\n  }\n\n  /**\n  * main function\n  */\n  void main() {\n    vec3 cameraDir;\n    vec3 color;\n\n    cameraDir = normalize(vPosition - cameraPos);\n    color = intersectWorld(cameraPos, cameraDir);\n\n    gl_FragColor = vec4(color, 1.);\n  }\n";
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