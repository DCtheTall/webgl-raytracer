/*
 * Get the specular color of the plane
 */
vec3 getPlaneSpecularColor(vec3 position) {
  if (mod(floor(position.x) + floor(position.z), 2.) != 0.) {
    return vec3(1.);
  } else {
    return vec3(0.4);
  }
}

#pragma glslify: export(getPlaneSpecularColor);
