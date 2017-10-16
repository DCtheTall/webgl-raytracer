/*
 * Get the diffuse color of checkered plane
 */
vec3 getPlaneDiffuseColor(vec3 pos) {
  if (mod(floor(pos.x) + floor(pos.z), 2.) != 0.) {
    return vec3(0.9);
  } else {
    return vec3(0.2, 0.2, 0.4);
  }
}

#pragma glslify: export(getPlaneDiffuseColor);
