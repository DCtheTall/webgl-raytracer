#pragma glslify: getDiffuseColor = require('./get-diffuse-color');
#pragma glslify: getSpecularColor = require('./get-specular-color');
#pragma glslify: testForShadow = require('../optics/test-for-shadow', MAXIMUM_NUMBER_OF_SPHERES=MAXIMUM_NUMBER_OF_SPHERES, MAXIMUM_NUMBER_OF_CUBES=MAXIMUM_NUMBER_OF_CUBES, spherePositions=spherePositions, sphereRadii=sphereRadii, cubeMinExtents=cubeMinExtents, cubeMaxExtents=cubeMaxExtents, cubeRotationInverses=cubeRotationInverses, cubePositions=cubePositions);

vec3 getNaturalColor(
  vec3 ambientLightColor,
  vec3 diffuseColor,
  float phongExponent,
  vec3 specularColor,
  vec3 surfaceNormal,
  vec3 rayDirection,
  vec3 position,
  int numberOfLights,
  int numberOfSpheres,
  int numberOfCubes,
  in vec3 lightPositions[MAXIMUM_NUMBER_OF_LIGHTS],
  in vec3 lightColors[MAXIMUM_NUMBER_OF_LIGHTS],
  in vec3 spherePositions[MAXIMUM_NUMBER_OF_SPHERES],
  in float sphereRadii[MAXIMUM_NUMBER_OF_SPHERES],
  in vec3 cubeMinExtents[MAXIMUM_NUMBER_OF_CUBES],
  in vec3 cubeMaxExtents[MAXIMUM_NUMBER_OF_CUBES],
  in mat3 cubeRotationInverses[MAXIMUM_NUMBER_OF_CUBES],
  in vec3 cubePositions[MAXIMUM_NUMBER_OF_CUBES]
) {
  vec3 color;
  color = vec3(0.);
  for (int i = 0; i < MAXIMUM_NUMBER_OF_LIGHTS; i += 1) {
    if (i > numberOfLights) break;

    float lambertianMax;
    float specularMax;
    bool isInShadow[4];

    lambertianMax = 1.;
    specularMax = 1.;
    for (int j = 0; j < 4; j += 1) isInShadow[j] = false;
    testForShadow(
      position,
      lightPositions[i],
      surfaceNormal,
      length(lightPositions[i] - position),
      numberOfSpheres,
      spherePositions,
      sphereRadii,
      numberOfCubes,
      cubeMinExtents,
      cubeMaxExtents,
      cubeRotationInverses,
      cubePositions,
      isInShadow
    );
    for (int j = 0; j < 4; j += 1) {
      if (isInShadow[j]) {
        lambertianMax -= .2;
        specularMax -= 0.2475;
      }
    }

    color += diffuseColor * ambientLightColor;
    color += lambertianMax * getDiffuseColor(
      lightPositions[i],
      lightColors[i],
      position,
      surfaceNormal,
      diffuseColor
    );
    color += specularMax * getSpecularColor(
      lightPositions[i],
      lightColors[i],
      rayDirection,
      position,
      surfaceNormal,
      phongExponent,
      specularColor
    );
  }
  return color;
}

#pragma glslify: export(getNaturalColor);
