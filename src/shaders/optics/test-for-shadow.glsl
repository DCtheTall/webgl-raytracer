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
    for (int i = 0; i < MAXIMUM_NUMBER_OF_SPHERES; i += 1) {
      if (i > numberOfSpheres) break;

      vec3 ds;
      float dist;

      if (j == 0) ds = -dx - dy;
      else if (j == 1) ds = dx - dy;
      else if (j == 2) ds = dy - dx;
      else ds = dx + dy;
      if (length(ds) != 0.) ds = r * normalize(ds);
      dist = intersectSphere(rayStart, rayDirection, spherePositions[i], sphereRadii[i]);
      if (dist > 0. && dist < distanceToLight) inShadow[j] = true;
    }
  }
}

#pragma glslify: export(testForShadow);
