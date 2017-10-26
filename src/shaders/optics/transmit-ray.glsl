void transmitRay(
  vec3 incidentRayStart,
  vec3 incidentRayDirection,
  vec3 opticalAxis,
  float refractiveIndex,
  float radius,
  out vec3 transmittedRayStart,
  out vec3 transmittedRayDirection
) {
  vec3 normalAxis;
  vec2 opticalVector;
  mat2 Refraction_1;
  mat2 Refraction_2;

  // Axis normal to the optical axis in the plane defined by the optical axis and incident ray direction
  normalAxis = incidentRayDirection;
  normalAxis -= dot(incidentRayDirection, -opticalAxis) * opticalAxis;
  if (length(normalAxis) != 0.) normalAxis = normalize(normalAxis);

  // Optical vector for matrix ray tracing
  opticalVector = vec2(0., acos(dot(opticalAxis, -incidentRayDirection)));

  // Defining refraction matrices
  Refraction_1 = mat2(1., (1. - refractiveIndex) / (radius * refractiveIndex),
                      0.,                                1. / refractiveIndex);
  Refraction_2 = mat2(1., (refractiveIndex - 1.) / radius,
                      0.,                  refractiveIndex);

  // First refraction
  opticalVector = Refraction_1 * opticalVector;
  // Transmission through the material
  opticalVector.x += sin(opticalVector.y) * 2. * radius;

  // Determining the starting point of the transmitted ray
  transmittedRayStart = incidentRayStart;
  transmittedRayStart -= cos(opticalVector.y) * opticalAxis;
  transmittedRayStart += opticalVector.x * normalAxis;

  // Second refraction
  opticalVector = Refraction_2 * opticalVector;

  // Determining the direction of the outgoing ray
  transmittedRayDirection = -cos(opticalVector.y) * opticalAxis;
  transmittedRayDirection += sin(opticalVector.y) * normalAxis;
}

#pragma glslify: export(transmitRay);
