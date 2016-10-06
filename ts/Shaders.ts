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
  uniform float sphereShininess[32];
  uniform float sphereRefrIndex[32];
  uniform float sphereOpacity[32];

  const int numReflections = 3;

  /***** INTERSECTION TESTS FOR GEOMETRIES *****/

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

  /***** OPTICAL FUNCTIONS *****/

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
  * Determine the reflectance of the sphere using its refractive index
  * and the Fresnel equations
  */
  float determineReflectance(vec3 normal, vec3 rayDir, float refrIndex) {
    float cosine_i;
    float sine_i;
    float theta_t;
    float cosine_t;
    float refl;

    /* Snell's law to find the angle the transmitted ray makes with the normal */
    cosine_i = dot(normalize(normal), normalize(-rayDir));
    sine_i = length(cross( normalize(normal), normalize(-rayDir) ));
    theta_t = asin( sine_i / refrIndex );
    cosine_t = cos(theta_t);

    /* Finding reflectance with Fresnel's equations */
    refl = cosine_i - refrIndex * cosine_t;
    refl /= cosine_i + refrIndex * cosine_t;
    refl = pow(abs(refl), 2.);

    return clamp(refl, 0., 1.);
  }

  /**
  * Determine the direction of the transmitted light ray
  */
  void transmitRay( vec3 rayStart,
                    vec3 rayDir,
                    vec3 opticalAxis,
                    float refrIndex,
                    float radius,
                    out vec3 outStart,
                    out vec3 outDir )
  {
    vec3 normalAxis;
    vec2 opticalVec;
    mat2 Refr_1;
    mat2 Refr_2;

    /* Determining normal axis */
    normalAxis = rayDir - (dot(rayDir, -opticalAxis) * opticalAxis);
    if( length(normalAxis) != 0. ) normalAxis = normalize(normalAxis);

    /* Defining quantities for matrix ray tracing */
    opticalVec = vec2( 0., acos(dot(opticalAxis, -rayDir)) );
    Refr_1 = mat2( 1., (1. - refrIndex)/(radius * refrIndex), 0., 1./refrIndex );
    Refr_2 = mat2( 1., (refrIndex - 1.)/radius, 0., refrIndex );

    /* First refraction */
    opticalVec = Refr_1 * opticalVec;
    /* Translation through medium of the sphere */
    opticalVec.x += sin(opticalVec.y) * 2. * radius;

    /* Determining the starting point of the outgoing ray */
    outStart = rayStart - (cos(opticalVec.y) * opticalAxis) + (opticalVec.x * normalAxis);

    /* Second refraction */
    opticalVec = Refr_2 * opticalVec;

    /* Determining the direction of the outgoing ray */
    outDir = (-cos(opticalVec.y) * opticalAxis) + (sin(opticalVec.y) * normalAxis);
  }

  /***** COLORING FUNCTIONS *****/

  /**
  * Color fragment using Blinn-Phong global illumination model
  */
  vec3 getNaturalColor( vec3 pos,
                        vec3 normal,
                        vec3 viewDir,
                        vec3 diffColor,
                        vec3 specColor,
                        float shininess )
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

      for( int j = 0; j < 4; j++ ) isInShadow[j] = false;
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
      specular = clamp(intensities[i] * pow(dot(normal, H), shininess) / distance / distance, 0.01, sMax);

      color += (lambertian * diffColor + specular * specColor) * lightCol[i];
    }
    return color;
  }

  /**
  * Get refracted color of non-opaque objects
  */
  vec3 getRefractedColor(vec3 refrStart, vec3 rayDir, vec3 opticalAxis, float refrIndex, float radius, float opacity) {
    vec3 color;
    vec3 rayStart_f;
    vec3 rayDir_f;
    float closestDist;
    float dist;
    vec3 pos;
    vec3 normal;
    vec3 diffCol;
    vec3 specCol;
    float phongExp;
    float refl;
    float index;

    color = vec3(0.);
    transmitRay(refrStart, rayDir, opticalAxis, refrIndex, radius, rayStart_f, rayDir_f);

    closestDist = 100000.;

    dist = intersectPlane(rayStart_f, rayDir_f);
    if( dist > 0. ) {
      closestDist = dist;
      pos = dist * rayDir_f + rayStart_f;
      normal = vec3(0., 1., 0.);
      if( mod(floor(pos.x) + floor(pos.z), 2.) != 0. ) {
        diffCol = vec3(0.9);
        specCol = vec3(1.);
        refl = determineReflectance(normal, rayDir_f, 1.05);
      }
      else {
        diffCol = vec3(0.2, 0.2, 0.4);
        specCol = vec3(0.4);
        refl = determineReflectance(normal, rayDir_f, 1.2);
      }
    }

    for( int i = 0; i < 32; i++ ) {
      if( i >= numSpheres ) continue;

      float distance;
      distance = intersectSphere(rayStart_f, rayDir_f, spherePos[i], sphereRadius[i]);

      if( distance > 0. && distance < closestDist ) {
        dist = distance;
        closestDist = distance;
        pos = distance * rayDir_f + rayStart_f;
        normal = normalize(pos - spherePos[i]);
        diffCol = sphereDiff[i];
        specCol = sphereSpec[i];
        phongExp = sphereShininess[i];
        index = sphereRefrIndex[i];
        refl = determineReflectance(normal, rayDir_f, index);
      }
    }

    if( dist > 0. ) {
      color = getNaturalColor(pos, normal, -rayDir_f, diffCol, specCol, phongExp);
      color *= opacity;
    }

    return color;
  }

  /**
  * Get reflected color
  */
  vec3 getReflectedColor(vec3 reflStart, vec3 reflNormal, vec3 rayDir, float refl) {
    const int MAX_DEPTH = 2;

    vec3 color;
    float closestDist;
    vec3 reflDir;
    float dist;
    vec3 pos;
    vec3 normal;
    vec3 diffCol;
    vec3 specCol;
    float phongExp;
    float opacity;
    float index;
    float radius;

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
          if( i != 0 ) thisRefl = determineReflectance(normal, rayDir, 1.2);
        }
        else {
          diffCol = vec3(0.4, 0.4, 0.6);
          specCol = vec3(0.6);
          if( i != 0 ) thisRefl = determineReflectance(normal, rayDir, 1.7);
        }
        phongExp = 250.;
        opacity = 1.;
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
          phongExp = sphereShininess[i];
          index = sphereRefrIndex[i];
          if( i != 0 ) determineReflectance(normal, rayDir, index);
          opacity = sphereOpacity[i];
          radius = sphereRadius[i];
        }
      }

      if( dist > 0. ) {
        vec3 c = getNaturalColor(pos, normal, -reflDir, diffCol, specCol, phongExp);
        refl *= thisRefl;
        color += pow(refl, float(i+1)) * c;
        if( opacity != 1. ) {
          color *= opacity;
          vec3 refrCol;
          refrCol = getRefractedColor(pos, -reflDir, normal, index, radius, opacity);
          refrCol *= 1. - opacity;
          color += refrCol;
        }

        reflStart = pos;
        reflNormal = normal;
        rayDir = reflDir;
      }
      else break;
    }

    return color;
  }

  /***** MAIN PROGRAM *****/

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
    float phongExp;
    float refl;
    float opacity;
    float index;
    float radius;


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
        refl = determineReflectance(normal, rayDir, 1.05);
      }
      else {
        diffCol = vec3(0.2, 0.2, 0.4);
        specCol = vec3(0.4);
        refl = determineReflectance(normal, rayDir, 1.2);
      }
      phongExp = 250.;
      opacity = 1.;
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
        phongExp = sphereShininess[i];
        index = sphereRefrIndex[i];
        refl = determineReflectance(normal, rayDir, index);
        opacity = sphereOpacity[i];
        radius = sphereRadius[i];
      }
    }

    if( dist > 0. ) {
      color = getNaturalColor(pos, normal, -rayDir, diffCol, specCol, phongExp);
      if( opacity != 1. ) {
        color *= opacity;
        vec3 refrCol;
        refrCol = getRefractedColor(pos, rayDir, normal, index, radius, opacity);
        refrCol *= 1. - opacity;
        color += refrCol;
      }
      color += getReflectedColor(pos, normal, rayDir, refl);
    }

    return color;
  }

  /**
  * Main function, just determines the direction of the initial ray and
  * calls intersectWorld()
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
