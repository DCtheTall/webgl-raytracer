/*

WebGL Raytracer
---------------

Scene object:
- Initializes instance of WebGL
- Calls functions for WebGL to render

*/

import Vector from "./Vector";
import Camera from "./Camera";
import initShaders from "./Shaders";

class Raytracer {
  private gl: WebGLRenderingContext;
  private shaderProgram: WebGLProgram;
  private camera: Camera;

  /*
  * @class Raytracer
  * @constructor
  */
  constructor(canvas: HTMLCanvasElement) {
    // Initialzing WebGL
    this.gl = <WebGLRenderingContext>
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clearColor(0, 0, 0, 1);
    // Initializing shaders
    this.shaderProgram = initShaders(this.gl);
    if( this.shaderProgram === null ) {
      throw new Error("Could not compile shaders. See error message for details.");
    }
    // Initializing buffers
    this.initBuffers();
    // Setting camera to null
    this.camera = null;
  }

  /*
  * This method initializes the vertex buffers
  *
  * @class Raytracer
  * @method initBuffers
  */
  private initBuffers(): void {
    let aWindowPosition: number;
    let vertices: number[];
    let windowBuffer: WebGLBuffer;

    aWindowPosition = this.gl.getAttribLocation(this.shaderProgram, 'aWindowPosition');
    this.gl.enableVertexAttribArray(aWindowPosition);

    vertices = [
      1., 1.,
      -1., 1.,
      1., -1.,
      -1., -1.
    ];

    windowBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, windowBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(aWindowPosition, 2, this.gl.FLOAT, false, 0, 0);
  }

  /*
  * This method sets position and lookAt vectors of the camera
  *
  * @class Raycaster
  * @method setLookAt
  */
  public setLookAt( eyeX: number, eyeY: number, eyeZ: number,
                     atX: number,  atY: number,  atZ: number ): void
  {
    this.camera = new Camera(new Vector(eyeX, eyeY, eyeZ),
                             new Vector( atX,  atY,  atZ));
  }

  /*
  * This method renders the scene in WebGL
  *
  * @class Raycaster
  * @method render
  */
  public render(): void {
    // Clear last rendered frame
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Draw new frame
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
export default Raytracer;
