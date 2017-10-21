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
  in vec3 cubeMaxExtent
) {
  float tNear;
  float tFar;
  vec3 tMin;
  vec3 tMax;
  float tEnter;
  float tExit;

  tNear = -1000000000.;
  tFar = 1000000000.;
  tMin = (cubeMinExtent - rayStart) / rayDirection;
  tMax = (cubeMaxExtent - rayStart) / rayDirection;

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
  in vec3 cubeMinExtent,
  in vec3 cubeMaxExtent,
  inout bool inShadow[4]
) {
  vec3 rayDirection;
  float r;
  vec3 dx;
  vec3 dy;
  float dist;

  rayDirection = normalize(lightPosition - rayStart);
  r = .01;
  dx = cross(surfaceNormal, rayDirection);
  if (length(dx) != 0.) dx = normalize(dx);
  dy = cross(rayDirection, dx);
  if (length(dy) != 0.) dy = normalize(dx);

  for (int j = 0; j < 4; j++) {
    vec3 ds;

    if (j == 0) ds = -dx - dy;
    else if (j == 1) ds = dx - dy;
    else if (j == 2) ds = dy - dx;
    else ds = dx + dy;

    for (int i = 0; i < MAXIMUM_NUMBER_OF_SPHERES; i += 1) {
      if (i > numberOfSpheres) break;

      if (length(ds) != 0.) ds = r * normalize(ds);
      dist = intersectSphere(rayStart, rayDirection + ds, spherePositions[i], sphereRadii[i]);
      if (dist > 0. && dist < distanceToLight) inShadow[j] = true;
    }

    dist = intersectCube(rayStart, rayDirection + ds, cubeMinExtent, cubeMaxExtent);
    if (dist > 0. && dist < distanceToLight) inShadow[j] = true;
  }
}

#pragma glslify: export(testForShadow);
