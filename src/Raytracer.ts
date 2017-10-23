import Camera from './Camera';
import Light from './Light';
import Sphere from './Sphere';
import Cube from './Cube';

export default class Raytracer {
  private aspectRatio: number;
  private gl: WebGLRenderingContext;
  private windowPositionBuffer: WebGLBuffer;
  private cameraViewDirectionBuffer: WebGLBuffer;
  private shaderProgram: WebGLProgram;
  private ambientLightColor: number[];

  public camera: Camera;
  public lights: Light[];
  public spheres: Sphere[];
  public cube: Cube;

  constructor(canvas: HTMLCanvasElement) {
    this.aspectRatio = canvas.width / canvas.height;
    this.gl = <WebGLRenderingContext>canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.clearColor(0, 0, 0, 1);
    this.windowPositionBuffer = this.gl.createBuffer();
    this.cameraViewDirectionBuffer = this.gl.createBuffer();
    this.ambientLightColor = [.2, .2, .2];
    this.camera = new Camera();
    this.lights = [];
    this.spheres = [];
    this.cube = null;
  }

  private compileShader(shaderSource: string, shaderType: number): WebGLShader {
    let shader: WebGLShader;

    shader = this.gl.createShader(shaderType);
    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(`Shader failed to compile: ${this.gl.getShaderInfoLog(shader)}`);
      return null;
    }
    return shader;
  }

  private createShaderProgram(): void {
    let vertexShaderSource: string;
    let fragmentShaderSource: string;
    let vertexShader: WebGLShader;
    let fragmentShader: WebGLShader;
    let shaderProgram: WebGLProgram;

    vertexShaderSource = require('./shaders/vertex.glsl'); // import using glslify-loader into JS string
    fragmentShaderSource = require('./shaders/fragment.glsl');
    if (process.env.NODE_ENV === 'development') console.log(fragmentShaderSource);
    vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
    fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);
    if (vertexShader === null || fragmentShader === null) {
      throw new Error('Shader failed to compile. See error message for details.');
    }
    shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);
    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      throw new Error('Could not initialize shader program.');
    }
    if (process.env.NODE_ENV === 'development') console.log('compiled shaders successfully');
    this.gl.useProgram(shaderProgram);
    this.shaderProgram = shaderProgram;
  }

  private sendVecAttribute(
    buffer: WebGLBuffer,
    attrLocation: number,
    dimension: number,
    values: Float32Array
  ): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(attrLocation, dimension, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(attrLocation);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, values, this.gl.DYNAMIC_DRAW);
  }

  private sendAttributes(): void {
    let windowCorners: Float32Array;
    let attribLocation: number;

    windowCorners = new Float32Array([-1,  1,
                                      -1, -1,
                                       1,  1,
                                       1, -1]);
    attribLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_WindowPosition');
    this.sendVecAttribute(
      this.windowPositionBuffer,
      attribLocation,
      2,
      windowCorners
    );
    attribLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_CameraViewPosition');
    this.sendVecAttribute(
      this.cameraViewDirectionBuffer,
      attribLocation,
      3,
      this.camera.getCameraViewPositions(this.aspectRatio)
    );
    attribLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_CameraViewDirection');
    this.sendVecAttribute(
      this.cameraViewDirectionBuffer,
      attribLocation,
      3,
      this.camera.getCameraViewDirections(this.aspectRatio)
    );
    console.log(this.camera.getCameraViewDirections(this.aspectRatio));
  }

  private sendLightUniforms(light: Light, i: number): void {
    let uniformLocation: WebGLUniformLocation;

    if (this.spheres.length > 8) throw new Error('Can only have up to 8 lights without modifying shader');
    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_NumberOfLights`);
    this.gl.uniform1i(uniformLocation, this.lights.length);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_LightPositions[${i}]`);
    this.gl.uniform3fv(uniformLocation, light.position.getElements());

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_LightColors[${i}]`);
    this.gl.uniform3fv(uniformLocation, light.color);
  }

  private sendSphereUniforms(sphere: Sphere, i: number): void {
    let uniformLocation: WebGLUniformLocation;

    if (this.spheres.length > 16) throw new Error('Can only have up to 16 spheres without modifying shader');
    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_NumberOfSpheres');
    this.gl.uniform1i(uniformLocation, this.spheres.length);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_SpherePositions[${i}]`);
    this.gl.uniform3fv(uniformLocation, sphere.position.getElements());

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_SphereRadii[${i}]`);
    this.gl.uniform1f(uniformLocation, sphere.radius);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_SphereDiffuseColors[${i}]`);
    this.gl.uniform3fv(uniformLocation, sphere.diffuseColor);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_SpherePhongExponents[${i}]`);
    this.gl.uniform1f(uniformLocation, sphere.phongExponent);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_SphereSpecularColors[${i}]`);
    this.gl.uniform3fv(uniformLocation, sphere.specularColor);
  }

  private sendCubeUniforms(): void {
    let uniformLocation: WebGLUniformLocation;

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_CubeMinExtent');
    this.gl.uniform3fv(uniformLocation, this.cube.minExtent.getElements());

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_CubeMaxExtent');
    this.gl.uniform3fv(uniformLocation, this.cube.maxExtent.getElements());

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_CubeRotationInverse');
    this.gl.uniformMatrix3fv(uniformLocation, false, this.cube.getInverseRotationMatrix());

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_CubePosition');
    this.gl.uniform3fv(uniformLocation, this.cube.position.getElements());

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_CubeDiffuseColor');
    this.gl.uniform3fv(uniformLocation, this.cube.diffuseColor);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_CubeSpecularColor');
    this.gl.uniform3fv(uniformLocation, this.cube.specularColor);
  }

  private sendUniforms(): void {
    let uniformLocation: WebGLUniformLocation;

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_CameraPosition');
    this.gl.uniform3fv(uniformLocation, this.camera.getEye().getElements());

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_AmbientLightColor');
    this.gl.uniform3fv(uniformLocation, this.ambientLightColor);

    this.lights.forEach(this.sendLightUniforms.bind(this));
    this.spheres.forEach(this.sendSphereUniforms.bind(this));
    this.sendCubeUniforms();
  }

  public render(): void {
    if (!this.shaderProgram) this.createShaderProgram();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.sendAttributes();
    this.sendUniforms();
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
