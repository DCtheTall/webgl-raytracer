precision mediump float;

attribute vec2 a_WindowPosition;

void main() {
  gl_Position = vec4(a_WindowPosition, 1., 1.);
}
