/*

WebGL Raytracer
---------------

Scene object:
- Initializes instance of WebGL
- Calls functions for WebGL to render
- Initializes the shaders using initShaders()
- Sends information about the camera to the GPU
- Renders the scene

*/

import Vector from "./Vector";
import Camera from "./Camera";
import initShaders from "./Shaders";
import Light from "./Light";
import Sphere from "./Sphere";

export default class Raytracer {

  private ASPECT_RATIO: number;
  private gl: WebGLRenderingContext;
  private shaderProgram: WebGLProgram;
  private camera: Camera;

  public lights: Light[];
  public spheres: Sphere[];
  public ANIMATE: boolean;

  /*
  * @class Raytracer
  * @constructor
  */
  constructor(canvas: HTMLCanvasElement) {
    this.ASPECT_RATIO = canvas.width / canvas.height;
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
    this.initBuffers();
    // Setting camera to null
    this.camera = null;
    // Initializing lights array
    this.lights = [];
    // Initializing spheres array
    this.spheres = [];
    // Initializing flag for whether the raytracer animates
    this.ANIMATE = false;
  }

  /*
  * This method initializes the vertex buffers, input is aspect ratio
  *
  * @class Raytracer
  * @method initBuffers
  */
  private initBuffers(): void {
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
  public render(animate: (raytracer: Raytracer) => void): void {
    // Executes callback for each draw
    animate(this);

    const AspRat: number = this.ASPECT_RATIO;
    let cameraPosition: WebGLUniformLocation;
    let lightUniform: WebGLUniformLocation;
    let sphereUniform: WebGLUniformLocation;
    let cameraTopLeft: Vector;
    let cameraBottomLeft: Vector;
    let cameraTopRight: Vector;
    let cameraBottomRight: Vector;
    let corners: number[];
    let aPosition: number;

    // Clear last rendered frame
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Passing camera position to the shader
    cameraPosition = this.gl.getUniformLocation(this.shaderProgram, 'cameraPos');
    this.gl.uniform3fv(cameraPosition, new Float32Array(Vector.push(this.camera.pos, [])));

    // Passing lights to the shader
    lightUniform = this.gl.getUniformLocation(this.shaderProgram, 'numLights');
    this.gl.uniform1i(lightUniform, this.lights.length);
    this.lights.map((currLight: Light, index: number) => {
      // Sending positions
      lightUniform = this.gl.getUniformLocation(this.shaderProgram, 'lightPos['+index+']');
      this.gl.uniform3fv(lightUniform, new Float32Array(Vector.push(currLight.position, [])));
      // Sending colors
      lightUniform = this.gl.getUniformLocation(this.shaderProgram, 'lightCol['+index+']');
      this.gl.uniform3fv(lightUniform, new Float32Array(Vector.push(currLight.color, [])));
      // Sending intensities
      lightUniform = this.gl.getUniformLocation(this.shaderProgram, 'intensities['+index+']');
      this.gl.uniform1f(lightUniform, currLight.intensity);
    });

    // Passing spheres to the shader
    sphereUniform = this.gl.getUniformLocation(this.shaderProgram, 'numSpheres');
    this.gl.uniform1i(sphereUniform, this.spheres.length);
    this.spheres.map((currSphere: Sphere, index: number) => {
      // Sending positions
      sphereUniform = this.gl.getUniformLocation(this.shaderProgram, 'spherePos['+index+']');
      this.gl.uniform3fv(sphereUniform, new Float32Array(Vector.push(currSphere.position, [])));
      // Sending radius of sphere
      sphereUniform = this.gl.getUniformLocation(this.shaderProgram, 'sphereRadius['+index+']');
      this.gl.uniform1f(sphereUniform, currSphere.radius);
      // Sending diffuse colors
      sphereUniform = this.gl.getUniformLocation(this.shaderProgram, 'sphereDiff['+index+']');
      this.gl.uniform3fv(sphereUniform, new Float32Array(Vector.push(currSphere.diffuse, [])));
      // Sending specular colors
      sphereUniform = this.gl.getUniformLocation(this.shaderProgram, 'sphereSpec['+index+']');
      this.gl.uniform3fv(sphereUniform, new Float32Array(Vector.push(currSphere.specular, [])));
      // Sending Phong exponent to the shader
      sphereUniform = this.gl.getUniformLocation(this.shaderProgram, 'sphereRoughness['+index+']');
      this.gl.uniform1f(sphereUniform, currSphere.roughness);
      // Sending the sphere reflecitivy to the shader
      sphereUniform = this.gl.getUniformLocation(this.shaderProgram, 'sphereRefl['+index+']');
      this.gl.uniform1f(sphereUniform, currSphere.reflectivity);
    });

    // Get camera corners
    corners = [];
    cameraTopLeft = Vector.add(
      this.camera.forward,
      Vector.subtract(this.camera.up, Vector.scale(AspRat, this.camera.right))
    );
    cameraBottomLeft = Vector.subtract(
      this.camera.forward,
      Vector.add(this.camera.up, Vector.scale(AspRat, this.camera.right))
    );
    cameraTopRight = Vector.add(
      this.camera.forward,
      Vector.add(this.camera.up, Vector.scale(AspRat, this.camera.right))
    );
    cameraBottomRight = Vector.add(
      this.camera.forward,
      Vector.subtract(Vector.scale(AspRat, this.camera.right), this.camera.up)
    );
    Vector.push(cameraTopLeft, corners);
    Vector.push(cameraBottomLeft, corners);
    Vector.push(cameraTopRight, corners);
    Vector.push(cameraBottomRight, corners);

    // Passing corners to the shader via the array buffer
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(corners), this.gl.STATIC_DRAW);

    // Draw new frame
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    // Render loop
    if( this.ANIMATE ) window.requestAnimationFrame(() => { this.render(animate); });
  }
}
