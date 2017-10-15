/**
* Ray intersection test for a plane at y = 0
*/
float intersectPlane(vec3 rayStart, vec3 rayDir) {
  float dist;
  float denom;

  dist = -1.;
  denom = dot(rayDir, vec3(0., 1., 0.));
  if (denom < 0.) {
    dist = dot(-rayStart, vec3(0., 1., 0.)) / denom;
  }
  return dist;
}

#pragma glslify: export(intersectPlane);
