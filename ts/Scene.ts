/*

WebGL Raytracer
---------------

Scene object

*/

class Scene {
  private gl: WebGLRenderingContext;

  constructor(canvas: HTMLCanvasElement) {
    // Initialzing WebGL
    this.gl = <WebGLRenderingContext> canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}
export default Scene;
