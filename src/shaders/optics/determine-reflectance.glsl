/**
 * Determine the reflectance of a surface using Fresnel equations
 */
float determineReflectance(vec3 surfaceNormal, vec3 rayDirection, float refractiveIndex) {
  float cosine_i;
  float sine_i;
  float theta_t;
  float cosine_t;
  float reflectance;

  /* Snell's law to find the angle the transmitted ray makes with the normal */
  cosine_i = dot(normalize(surfaceNormal), normalize(-rayDirection));
  sine_i = length(cross(normalize(surfaceNormal), normalize(-rayDirection)));
  theta_t = asin(sine_i / refractiveIndex);
  cosine_t = cos(theta_t);

  /* Finding reflectance with Fresnel's equations */
  reflectance = cosine_i - (refractiveIndex * cosine_t);
  reflectance /= cosine_i + (refractiveIndex * cosine_t);
  reflectance = pow(abs(reflectance), 2.);

  return clamp(reflectance, 0., 1.);
}

#pragma glslify: export(determineReflectance);
