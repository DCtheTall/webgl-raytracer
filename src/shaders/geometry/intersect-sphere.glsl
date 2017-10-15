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

#pragma glslify: export(intersectSphere);
