/*
 * Get the natural matte color of a surface
 * implements Lambertian lighting model
 */
vec3 getDiffuseColor(
  vec3 lightPosition,
  vec3 lightColor,
  vec3 position,
  vec3 surfaceNormal,
  vec3 diffuseColor
) {
  vec3 incidentLightDirection;
  float dist;
  float lambertian;
  incidentLightDirection = normalize(position - lightPosition);
  dist = length(position - lightPosition);
  lambertian = clamp(-dot(incidentLightDirection, surfaceNormal), 0., 1.) / dist;
  return lambertian * lightColor * diffuseColor;
}

#pragma glslify: export(getDiffuseColor);
