#pragma glslify: intersectSphere = require('../geometry/intersect-sphere');

/*
 * Tests if a fragment is in the shadow of another element
 */
void testForShadow(
  vec3 rayStart,
  vec3 rayDirection,
  vec3 surfaceNormal,
  float distanceToLight,
  int numberOfSpheres,
  in vec3 spherePositions[MAXIMUM_NUMBER_OF_SPHERES],
  in float sphereRadii[MAXIMUM_NUMBER_OF_SPHERES],
  inout bool inShadow[4]
) {
  float r;
  vec3 dx;
  vec3 dy;

  r = .01;
  dx = cross(surfaceNormal, rayDirection);
  if (length(dx) != 0.) dx = normalize(dx);
  dy = cross(rayDirection, dx);
  if (length(dy) != 0.) dy = normalize(dx);

  for( int j = 0; j < 4; j++ )
  for( int i = 0; i < MAXIMUM_NUMBER_OF_SPHERES; i++ ) {
    if (i > numberOfSpheres) break;

    vec3 ds;
    float dist;

    if (j == 0) ds = -dx - dy;
    else if (j == 1) ds = dx - dy;
    else if (j == 2) ds = dy - dx;
    else ds = dx + dy;
    if (length(ds) != 0.) ds = r * normalize(ds);
    dist = intersectSphere(
      rayStart,
      rayDirection,
      spherePositions[i],
      sphereRadii[i]
    );
    if (dist > 0. && dist < distanceToLight) inShadow[j] = true;
  }
}

#pragma glslify: export(testForShadow);
