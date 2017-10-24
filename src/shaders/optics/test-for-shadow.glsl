/**
* Ray intersection test for spheres
*/
float intersectSphere(vec3 rayStart, vec3 rayDir, vec3 center, float r) {
  vec3 at;
  float v;
  float dist;
  float disc;

  at = center - rayStart;
  v = dot(at, rayDir);
  dist = -1.;
  if (v >= 0.) {
    disc = r * r - (dot(at, at) - v * v);
    if (disc > 0.) dist = v - sqrt(disc);
  }
  return dist;
}

/**
 * Ray intersection test for a coaxial cube
 */
float intersectCube(
  vec3 rayStart,
  vec3 rayDirection,
  in vec3 cubeMinExtent,
  in vec3 cubeMaxExtent,
  in mat3 cubeRotationInverse,
  in vec3 cubePosition
) {
  vec3 start;
  vec3 direction;
  float tNear;
  float tFar;
  vec3 tMin;
  vec3 tMax;
  float tEnter;
  float tExit;

  start = rayStart - cubePosition;
  start = cubeRotationInverse * start;
  direction = cubeRotationInverse * rayDirection;

  tNear = -1000000000.;
  tFar = 1000000000.;
  tMin = (cubeMinExtent - start) / direction;
  tMax = (cubeMaxExtent - start) / direction;

  tEnter = min(tMin.x, tMax.x);
  tExit = max(tMin.x, tMax.x);
  if (tEnter > tNear) tNear = tEnter;
  if (tExit < tFar) tFar = tExit;

  tEnter = min(tMin.y, tMax.y);
  tExit = max(tMin.y, tMax.y);
  if (tEnter > tNear) tNear = tEnter;
  if (tExit < tFar) tFar = tExit;

  tEnter = min(tMin.z, tMax.z);
  tExit = max(tMin.z, tMax.z);
  if (tEnter > tNear) tNear = tEnter;
  if (tExit < tFar) tFar = tExit;

  if (tNear < tFar) return tNear;
  return -1.;
}

/*
 * Tests if a fragment is in the shadow of another element
 */
void testForShadow(
  vec3 rayStart,
  vec3 lightPosition,
  vec3 surfaceNormal,
  float distanceToLight,
  int numberOfSpheres,
  in vec3 spherePositions[MAXIMUM_NUMBER_OF_SPHERES],
  in float sphereRadii[MAXIMUM_NUMBER_OF_SPHERES],
  int numberOfCubes,
  in vec3 cubeMinExtents[MAXIMUM_NUMBER_OF_CUBES],
  in vec3 cubeMaxExtents[MAXIMUM_NUMBER_OF_CUBES],
  in mat3 cubeRotationInverses[MAXIMUM_NUMBER_OF_CUBES],
  in vec3 cubePositions[MAXIMUM_NUMBER_OF_CUBES],
  inout bool inShadow[4]
) {
  vec3 rayDirection;
  float r;
  vec3 dx;
  vec3 dy;

  rayDirection = normalize(lightPosition - rayStart);
  r = .01;
  dx = cross(surfaceNormal, rayDirection);
  if (length(dx) != 0.) dx = normalize(dx);
  dy = cross(rayDirection, dx);
  if (length(dy) != 0.) dy = normalize(dx);

  for (int j = 0; j < 4; j++) {
    vec3 ds;
    float dist;

    if (j == 0) ds = -dx - dy;
    else if (j == 1) ds = dx - dy;
    else if (j == 2) ds = dy - dx;
    else ds = dx + dy;
    if (length(ds) != 0.) ds = r * normalize(ds);

    // Test if the spheres block the light
    for (int i = 0; i < MAXIMUM_NUMBER_OF_SPHERES; i += 1) {
      if (i == numberOfSpheres) break;
      dist = intersectSphere(rayStart, normalize(rayDirection + ds), spherePositions[i], sphereRadii[i]);
      if (dist > 0. && dist < distanceToLight) inShadow[j] = true;
    }

    // Test if the cube blocks the light
    for (int i = 0; i < MAXIMUM_NUMBER_OF_CUBES; i += 1) {
      if (i == numberOfCubes) break;
      dist = intersectCube(
        rayStart,
        normalize(rayDirection + ds),
        cubeMinExtents[i],
        cubeMaxExtents[i],
        cubeRotationInverses[i],
        cubePositions[i]
      );
      if (dist > 0.1 && dist < distanceToLight) inShadow[j] = true;
    }
  }
}

#pragma glslify: export(testForShadow);
