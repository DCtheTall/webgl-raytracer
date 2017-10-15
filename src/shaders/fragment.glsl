precision mediump float;

const int MAXIMUM_NUMBER_OF_SPHERES = 16;

varying vec3 v_CameraViewDirection;

uniform vec3 u_CameraPosition;
uniform int u_NumberOfSpheres;
uniform vec3 u_SpherePositions[MAXIMUM_NUMBER_OF_SPHERES];
uniform float u_SphereRadii[MAXIMUM_NUMBER_OF_SPHERES];
uniform vec3 u_SphereDiffuseColors[MAXIMUM_NUMBER_OF_SPHERES];

#pragma glslify: intersectSphere = require('./geometry/intersect-sphere');

/*
 * Ray intersection test for the scene
 */
vec3 intersectScene(vec3 rayStart, vec3 rayDirection) {
  vec3 color;
  float closestDistance;
  float distance;

  color = vec3(0.);
  closestDistance = 1000000.;

  for (int i = 0; i < MAXIMUM_NUMBER_OF_SPHERES; i += 1) {
    if (i > u_NumberOfSpheres) break;

    vec3 position;

    distance = intersectSphere(rayStart, rayDirection, u_SpherePositions[i], u_SphereRadii[i]);
    if (distance > 0. && distance < closestDistance) {
      distance = closestDistance;
      color = u_SphereDiffuseColors[i];
    }
  }

  return color;
}

void main() {
  vec3 viewDirection;
  vec3 fragColor;
  viewDirection = normalize(v_CameraViewDirection - u_CameraPosition);
  fragColor = intersectScene(u_CameraPosition, viewDirection);
  gl_FragColor = vec4(fragColor, 1.);
}
