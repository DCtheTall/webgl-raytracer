precision mediump float;

varying vec3 v_CameraViewDirection;

uniform vec3 u_CameraPosition;

/*
 * Ray intersection test for the scene
 */
vec3 intersectScene(vec3 rayStart, vec3 rayDirection) {
  vec3 color;
  color = vec3(0.);
  return color;
}

void main() {
  vec3 fragColor;
  fragColor = intersectScene(u_CameraPosition, v_CameraViewDirection);
  gl_FragColor = vec4(fragColor, 1.);
}
