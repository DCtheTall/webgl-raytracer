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
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clearDepth(1);
    // Initializing shaders
    this.shaderProgram = initShaders(this.gl);
    if( this.shaderProgram === null ) {
      throw new Error("Could not compile shaders. See error message for details.");
    }
    // Initializing buffers
    this.initBuffers(canvas.width / canvas.height);
    // Setting camera to null
    this.camera = null;
  }

  /*
  * This method initializes the vertex buffers, input is aspect ratio
  *
  * @class Raytracer
  * @method initBuffers
  */
  private initBuffers(ratio: number): void {
    let aWindowPosition: number;
    let aPosition: number;
    let vertices: number[];
    let windowBuffer: WebGLBuffer;
    let positionBuffer: WebGLBuffer;

    // Buffer for the vertices of the window
    aWindowPosition = this.gl.getAttribLocation(this.shaderProgram, 'aWindowPosition');
    this.gl.enableVertexAttribArray(aWindowPosition);

    aPosition = this.gl.getAttribLocation(this.shaderProgram, 'aPosition');
    this.gl.enableVertexAttribArray(aPosition);

    vertices = [
      -1., 1.,
      -1., -1.,
      1., 1.,
      1., -1.
    ];

    windowBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, windowBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, windowBuffer);
    this.gl.vertexAttribPointer(aWindowPosition, 2, this.gl.FLOAT, false, 0, 0);

    positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.vertexAttribPointer(aPosition, 3, this.gl.FLOAT, false, 0, 0);
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
    let cameraPosition: WebGLUniformLocation;
    let cameraTopLeft: Vector;
    let cameraBottomLeft: Vector;
    let cameraTopRight: Vector;
    let cameraBottomRight: Vector;
    let corners: number[] = [];
    let aPosition: number;

    // Clear last rendered frame
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Passing camera position to the shader
    cameraPosition = this.gl.getUniformLocation(this.shaderProgram, 'cameraPosition');
    this.gl.uniform3fv(cameraPosition, new Float32Array(Vector.push(this.camera.pos, [])));

    // Get camera corners
    cameraTopLeft = Vector.add(
      this.camera.forward, Vector.subtract(this.camera.up, this.camera.right)
    );
    cameraBottomLeft = Vector.subtract(
      this.camera.forward, Vector.add(this.camera.up, this.camera.right)
    );
    cameraTopRight = Vector.add(
      this.camera.forward, Vector.add(this.camera.up, this.camera.right)
    );
    cameraBottomRight = Vector.add(
      this.camera.forward, Vector.subtract(this.camera.right, this.camera.up)
    );
    Vector.push(cameraTopLeft, corners);
    Vector.push(cameraBottomLeft, corners);
    Vector.push(cameraTopRight, corners);
    Vector.push(cameraBottomRight, corners);

    // Passing corners to the shader
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(corners), this.gl.STATIC_DRAW);

    // Draw new frame
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
export default Raytracer;
