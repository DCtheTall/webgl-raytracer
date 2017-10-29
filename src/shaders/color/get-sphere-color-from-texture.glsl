/**
 * This function gets the color at a point on the sphere from a texture
 */
vec3 getSphereColorFromTexture(
  vec3 radialVector,
  sampler2D textureSampler
) {
  float xzRadius;
  float xzTheta;
  float longitude;
  float latitude;
  vec2 texturePosition;
  vec3 color;

  xzRadius = length(vec2(radialVector.xz));
  if (xzRadius == 0.) {
    xzTheta = 0.;
  } else if (radialVector.z >= 0.) {
    xzTheta = acos(-radialVector.x / xzRadius);
  } else if (radialVector.z < 0.) {
    xzTheta = PI + acos(radialVector.x / xzRadius);
  }
  longitude = xzTheta / (2. * PI);
  latitude = -(.5 * radialVector.y) + .5;
  color = texture2D(textureSampler, vec2(longitude, latitude)).xyz;

  return color;
}

#pragma glslify: export(getSphereColorFromTexture);
