import Camera from './Camera';

export default class Raytracer {
  private aspectRatio: number;
  private gl: WebGLRenderingContext;
  private windowPositionBuffer: WebGLBuffer;
  private cameraViewDirectionBuffer: WebGLBuffer;
  private shaderProgram: WebGLProgram;

  public camera: Camera;

  constructor(canvas: HTMLCanvasElement) {
    this.aspectRatio = canvas.width / canvas.height;
    this.gl = <WebGLRenderingContext>canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.clearColor(0, 0, 0, 1);
    this.windowPositionBuffer = this.gl.createBuffer();
    this.cameraViewDirectionBuffer = this.gl.createBuffer();
    this.camera = new Camera();
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
    console.log('compiled shaders successfully');
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
    let aWindowPosition: number;
    let aCameraViewDirection: number;

    windowCorners = new Float32Array([-1,  1,
                                      -1, -1,
                                       1,  1,
                                       1, -1]);
    aWindowPosition = this.gl.getAttribLocation(this.shaderProgram, 'a_WindowPosition');
    this.sendVecAttribute(
      this.windowPositionBuffer,
      aWindowPosition,
      2,
      windowCorners
    );
    aCameraViewDirection = this.gl.getAttribLocation(this.shaderProgram, 'a_CameraViewDirection');
    this.sendVecAttribute(
      this.cameraViewDirectionBuffer,
      aCameraViewDirection,
      3,
      this.camera.getCameraViewDirections(this.aspectRatio)
    );
  }

  private sendUniforms(): void {
    let uCameraPosition: WebGLUniformLocation;

    uCameraPosition = this.gl.getUniformLocation(this.shaderProgram, 'u_CameraPosition');
    this.gl.uniform3fv(uCameraPosition, this.camera.getEye().getElements());
  }

  public render(): void {
    if (!this.shaderProgram) this.createShaderProgram();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.sendAttributes();
    this.sendUniforms();
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
