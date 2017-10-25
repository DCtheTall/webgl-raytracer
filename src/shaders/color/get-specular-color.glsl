/*
 * get specular color of the material using Blinn-Phong illumination model
 */
vec3 getSpecularColor(
  vec3 lightPosition,
  vec3 lightColor,
  float lightIntensity,
  vec3 viewingDirection,
  vec3 position,
  vec3 surfaceNormal,
  float phongExponent,
  vec3 specularColor
) {
  vec3 incidentLightDirection;
  float dist;
  vec3 halfwayVector;
  vec3 reflectedLightDirection;
  float specular;
  incidentLightDirection = normalize(lightPosition - position);
  dist = length(lightPosition - position);
  halfwayVector = normalize(incidentLightDirection + viewingDirection);
  reflectedLightDirection = reflect(incidentLightDirection, surfaceNormal);
  specular = pow(clamp(-dot(halfwayVector, reflectedLightDirection), 0.01, 1.), phongExponent) / pow(dist, 2.);
  return  clamp(lightIntensity * specular, 0., 1.) * specularColor * lightColor;
}

#pragma glslify: export(getSpecularColor);
