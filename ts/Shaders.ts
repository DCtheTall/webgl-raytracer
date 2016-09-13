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
  uniform int numSpheres;
  uniform vec3 spherePos[32];
  uniform float sphereRadius[32];
  uniform vec3 sphereDiff[32];
  uniform vec3 sphereSpec[32];
  uniform float sphereRoughness[32];
  uniform float sphereRefl[32];

  const int numReflections = 3;

  /**
  * Intersection test for a plane at y = 0
  */
  float intersectPlane(vec3 rayStart, vec3 rayDir) {
    float dist;
    float denom;

    dist = -1.;
    denom = dot(rayDir, vec3(0., 1., 0.));
    if( denom < 0. ) {
      dist = dot(-rayStart, vec3(0., 1., 0.)) / denom;
    }

    return dist;
  }

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
  * Test for shadow casting implements pyramid tracing to soften shadow edges
  */
  void testForShadow( inout bool inShadow[4],
                        float distanceToLight,
                        vec3 rayStart,
                        vec3 rayDir,
                        vec3 normal )
  {
    vec3 dx;
    vec3 dy;
    float r;

    dx = cross(normal, rayDir);
    if( length(dx) != 0. ) dx = normalize(dx);
    dy = cross(rayDir, dx);
    if( length(dy) != 0. ) dy = normalize(dy);
    r = 0.01;

    for( int j = 0; j < 4; j++ )
    for( int i = 0; i < 32; i++ ) {
      if( i >= numSpheres ) continue;

      vec3 ds;
      float dist;

      if( j == 0 ){ ds = -dx - dy; }
      else if( j == 1 ){ ds = dx - dy; }
      else if( j == 2 ){ ds = dy - dx; }
      else { ds = dy + dx; }
      ds = r * normalize(ds);

      dist = intersectSphere(rayStart, normalize(rayDir + ds), spherePos[i], sphereRadius[i]);
      if( dist > 0. && dist < distanceToLight ) inShadow[j] = true;
    }
  }

  /**
  * Color fragment using Blinn-Phong global illumination model
  */
  vec3 getNaturalColor( vec3 pos,
                        vec3 normal,
                        vec3 viewDir,
                        vec3 diffColor,
                        vec3 specColor,
                        float roughness )
  {
    vec3 color = vec3(0.);
    for ( int i = 0; i < 32; i++ ) {
      if( i >= numLights ) continue;

      vec3 currPos;
      vec3 currColor;
      float intensity;
      vec3 lightDir;
      float distance;
      bool isInShadow[4];
      float lMax;
      float sMax;
      vec3 testColor;
      float lambertian;
      vec3 H;
      float specular;

      lightDir = normalize(lightPos[i] - pos);
      distance = length(lightPos[i] - pos);

      testForShadow(isInShadow, distance, pos, lightDir, normal);

      lMax = 1.; sMax = 1.;

      for( int j = 0; j < 4; j++ ) {
        if( isInShadow[j] ) {
          lMax -= 0.2;
          sMax -= 0.2475;
        }
      }

      lambertian = clamp(intensities[i] * dot(normal, lightDir) / distance, 0.0, lMax);

      H = normalize(lightDir + viewDir);
      specular = clamp(intensities[i] * pow(dot(normal, H), roughness) / distance / distance, 0.01, sMax);

      color += (lambertian * diffColor + specular * specColor) * lightCol[i];
    }
    return color;
  }

  /**
  * Get reflected color
  */
  vec3 getReflectedColor(vec3 reflStart, vec3 reflNormal, vec3 rayDir, float refl) {
    const int MAX_DEPTH = 3;

    vec3 color;
    float closestDist;
    vec3 reflDir;
    float dist;
    vec3 pos;
    vec3 normal;
    vec3 diffCol;
    vec3 specCol;
    float rough;

    color = vec3(0.);

    for( int i = 0; i <= MAX_DEPTH; i++ ) {
      float thisRefl = 1.;

      closestDist = 100000.;
      reflDir = reflect(rayDir, reflNormal);

      dist = intersectPlane(reflStart, reflDir);
      if( dist > 0. ) {
        closestDist = dist;
        pos = dist * reflDir + reflStart;
        normal = vec3(0., 1., 0.);
        if( mod(floor(pos.x) + floor(pos.z), 2.) != 0. ) {
          diffCol = vec3(0.9);
          specCol = vec3(1.);
          if( i != 0 ) thisRefl = 0.2;
        }
        else {
          diffCol = vec3(0.4, 0.4, 0.6);
          specCol = vec3(0.6);
          if( i != 0 ) thisRefl = 0.7;
        }
        rough = 250.;
      }

      for( int i = 0; i < 32; i++ ) {
        if( i >= numSpheres ) continue;

        float distance;
        distance = intersectSphere(reflStart, reflDir, spherePos[i], sphereRadius[i]);
        if( distance >= 0. && distance < closestDist ) {
          dist = distance;
          closestDist = dist;
          pos = dist * reflDir + reflStart;
          normal = normalize(pos - spherePos[i]);
          diffCol = sphereDiff[i];
          specCol = sphereSpec[i];
          rough = sphereRoughness[i];
          if( i != 0 ) thisRefl = sphereRefl[i];
        }
      }

      if( dist > 0. ) {
        vec3 c = getNaturalColor(pos, normal, -reflDir, diffCol, specCol, rough);
        refl *= thisRefl;
        color += pow(refl, float(i+1)) * c;

        reflStart = pos;
        reflNormal = normal;
        rayDir = reflDir;
      }
      else break;
    }

    return color;
  }

  /**
  * Intersection test for the world
  * returns a color vector
  */
  vec3 intersectWorld(vec3 rayStart, vec3 rayDir) {
    vec3 color;
    float closestDist;
    float dist;
    vec3 pos;
    vec3 normal;
    vec3 diffCol;
    vec3 specCol;
    float rough;
    float refl;

    color = vec3(0.);
    closestDist = 100000.;

    dist = intersectPlane(rayStart, rayDir);
    if( dist > 0. ) {
      closestDist = dist;
      pos = dist * rayDir + rayStart;
      normal = vec3(0., 1., 0.);
      if( mod(floor(pos.x) + floor(pos.z), 2.) != 0. ) {
        diffCol = vec3(0.9);
        specCol = vec3(1.);
        refl = 0.2;
      }
      else {
        diffCol = vec3(0.4, 0.4, 0.6);
        specCol = vec3(0.4);
        refl = 0.7;
      }
      rough = 250.;
    }

    for( int i = 0; i < 32; i++ ) {
      if( i >= numSpheres ) continue;

      float distance;
      distance = intersectSphere(rayStart, rayDir, spherePos[i], sphereRadius[i]);

      if( distance > 0. && distance < closestDist ) {
        dist = distance;
        closestDist = distance;
        pos = distance * rayDir + rayStart;
        normal = normalize(pos - spherePos[i]);
        diffCol = sphereDiff[i];
        specCol = sphereSpec[i];
        rough = sphereRoughness[i];
        refl = sphereRefl[i];
      }
    }

    if( dist > 0. ) {
      color = getNaturalColor(pos, normal, -rayDir, diffCol, specCol, rough);
      color += getReflectedColor(pos, normal, rayDir, refl);
    }

    return color;
  }

  /**
  * main function
  */
  void main() {
    vec3 cameraDir;
    vec3 color;

    cameraDir = normalize(vPosition - cameraPos);
    color = intersectWorld(cameraPos, cameraDir);

    gl_FragColor = vec4(color, 1.);
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
