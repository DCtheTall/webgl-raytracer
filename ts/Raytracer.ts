/*

WebGL Raytracer
---------------

Scene object:
- Initializes instance of WebGL
- Calls functions for WebGL to render

*/

import Vector from "./Vector";
import Camera from "./Camera";

class Raytracer {
  private gl: WebGLRenderingContext;
  public camera: Camera;

  constructor(canvas: HTMLCanvasElement) {
    // Initialzing WebGL
    this.gl = <WebGLRenderingContext> canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clearColor(0, 0, 0, 1);
    // Setting camera to null
    this.camera = null;
  }

  // Set position and lookAt vector of camera
  public setLookAt(eyeX: number, eyeY: number, eyeZ: number,
                    atX: number,  atY: number,  atZ: number): void {
    this.camera = new Camera(new Vector(eyeX, eyeY, eyeZ),
                             new Vector( atX,  atY,  atZ));
  }

  public render(): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}
export default Raytracer;
