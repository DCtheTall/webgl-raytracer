#pragma glslify: transpose = require('glsl-transpose');

/**
 * Gets the normal vector on the cube where the ray intersects the cube
 */
vec3 getCubeNormal(
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
  vec3 result;

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

  if (tNear == tMin.x) result = vec3(-1., 0., 0.);
  else if (tNear == tMax.x) result = vec3(1., 0., 0.);
  else if (tNear == tMin.y) result = vec3(0., -1., 0.);
  else if (tNear == tMax.y) result = vec3(0., 1., 0.);
  else if (tNear == tMin.z) result = vec3(0., 0., -1.);
  else result = vec3(0., 0., 1.);

  return transpose(cubeRotationInverse) * result;
}

#pragma glslify: export(getCubeNormal);
