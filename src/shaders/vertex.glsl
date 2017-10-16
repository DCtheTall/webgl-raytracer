precision mediump float;

attribute vec2 a_WindowPosition;
attribute vec3 a_CameraViewPosition;
attribute vec3 a_CameraViewDirection;

varying vec3 v_CameraViewPosition;
varying vec3 v_CameraViewDirection;

void main() {
  v_CameraViewPosition = a_CameraViewPosition;
  v_CameraViewDirection = a_CameraViewDirection;
  gl_Position = vec4(a_WindowPosition, 1., 1.);
}
