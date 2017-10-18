precision mediump float;

const int MAXIMUM_NUMBER_OF_SPHERES = 16;
const int MAXIMUM_NUMBER_OF_LIGHTS = 8;
const float FLOOR_PHONG_EXPONENT = 50.;

varying vec3 v_CameraViewPosition;
varying vec3 v_CameraViewDirection;

uniform vec3 u_CameraPosition;
uniform vec3 u_AmbientLightColor;

uniform int u_NumberOfLights;
uniform vec3 u_LightPositions[MAXIMUM_NUMBER_OF_LIGHTS];
uniform vec3 u_LightColors[MAXIMUM_NUMBER_OF_LIGHTS];

uniform int u_NumberOfSpheres;
uniform vec3 u_SpherePositions[MAXIMUM_NUMBER_OF_SPHERES];
uniform float u_SphereRadii[MAXIMUM_NUMBER_OF_SPHERES];
uniform vec3 u_SphereDiffuseColors[MAXIMUM_NUMBER_OF_SPHERES];
uniform float u_SpherePhongExponents[MAXIMUM_NUMBER_OF_SPHERES];
uniform vec3 u_SphereSpecularColors[MAXIMUM_NUMBER_OF_SPHERES];

#pragma glslify: getPlaneDiffuseColor = require('./color/get-plane-diffuse-color');
#pragma glslify: getPlaneSpecularColor = require('./color/get-plane-specular-color');
#pragma glslify: intersectPlane = require('./geometry/intersect-plane');
#pragma glslify: intersectSphere = require('./geometry/intersect-sphere');
#pragma glslify: getNaturalColor = require('./color/get-natural-color', MAXIMUM_NUMBER_OF_LIGHTS=MAXIMUM_NUMBER_OF_LIGHTS, MAXIMUM_NUMBER_OF_SPHERES=MAXIMUM_NUMBER_OF_SPHERES, spherePositions=spherePositions, sphereRadii=sphereRadii);

/*
 * Ray intersection test for the scene
 */
vec3 intersectScene(vec3 rayStart, vec3 rayDirection) {
  vec3 color;
  float closestDistance;
  float dist;
  vec3 position;
  vec3 surfaceNormal;
  vec3 diffuseColor;
  float phongExponent;
  vec3 specularColor;

  color = vec3(0.);
  closestDistance = -1.;

  // Testing if the ray intersects the spheres
  for (int i = 0; i < MAXIMUM_NUMBER_OF_SPHERES; i += 1) {
    if (i > u_NumberOfSpheres) break;
    dist = intersectSphere(
      rayStart,
      rayDirection,
      u_SpherePositions[i],
      u_SphereRadii[i]
    );
    if ((dist > 0. && closestDistance == -1.) || (dist > 0. && dist < closestDistance)) {
      closestDistance = dist;
      position = rayStart + (dist * rayDirection);
      surfaceNormal = normalize(position - u_SpherePositions[i]);
      diffuseColor = u_SphereDiffuseColors[i];
      phongExponent = u_SpherePhongExponents[i];
      specularColor = u_SphereSpecularColors[i];
    }
  }

  // Testing if the ray interests the ground plane
  dist = intersectPlane(rayStart, rayDirection);
  if ((dist > 0. && closestDistance == -1.)
      || (dist > 0. && dist < closestDistance)) {
    closestDistance = dist;
    position = rayStart + (dist * rayDirection);
    surfaceNormal = vec3(0., 1., 0.);
    diffuseColor = getPlaneDiffuseColor(position);
    phongExponent = FLOOR_PHONG_EXPONENT;
    specularColor = getPlaneSpecularColor(position);
  }

  // Determine color of the fragment
  if (closestDistance > 0.) {
    color = getNaturalColor(
      u_NumberOfLights,
      u_AmbientLightColor,
      diffuseColor,
      phongExponent,
      specularColor,
      surfaceNormal,
      rayDirection,
      position,
      u_NumberOfSpheres,
      u_LightPositions,
      u_LightColors,
      u_SpherePositions,
      u_SphereRadii
    );
  }

  return color;
}

/*
 * MAIM PROGRAM
 */
void main() {
  vec3 fragColor;
  fragColor = intersectScene(u_CameraPosition + v_CameraViewPosition, normalize(v_CameraViewDirection));
  gl_FragColor = vec4(fragColor, 1.);
}
