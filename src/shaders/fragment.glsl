precision mediump float;

#pragma glslify: getBlue = require(./get-blue.glsl);

void main() {
  vec4 color = getBlue();
  gl_FragColor = color;
}
