/*
 * get specular color of the material using Blinn-Phong illumination model
 */
vec3 getSpecularColor(
  vec3 lightPosition,
  vec3 lightColor,
  vec3 viewingDirection,
  vec3 position,
  vec3 surfaceNormal,
  float phongExponent,
  vec3 specularColor
) {
  vec3 incidentLightDirection;
  vec3 halfwayVector;
  vec3 reflectedLightDirection;
  float specular;
  incidentLightDirection = normalize(position - lightPosition);
  halfwayVector = normalize(incidentLightDirection + viewingDirection);
  reflectedLightDirection = reflect(incidentLightDirection, surfaceNormal);
  specular = pow(clamp(-dot(halfwayVector, reflectedLightDirection), 0., 1.), phongExponent);
  return specular * specularColor * lightColor;
}

#pragma glslify: export(getSpecularColor);
