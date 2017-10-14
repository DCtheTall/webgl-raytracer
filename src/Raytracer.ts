import Camera from './Camera';

export default class Raytracer {
  private ASPECT_RATIO: number;

  private gl: WebGLRenderingContext;
  private buffer: WebGLBuffer;
  private shaderProgram: WebGLProgram;
  private camera: Camera;

  constructor(canvas: HTMLCanvasElement) {
    this.ASPECT_RATIO = canvas.width / canvas.height;
    this.gl = <WebGLRenderingContext>canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.clearColor(0, 0, 0, 1);
    this.buffer = this.gl.createBuffer();
    this.camera = new Camera();
  }

  private compileShader(shaderSource: string, shaderType: number): WebGLShader {
    let shader: WebGLShader;

    shader = this.gl.createShader(shaderType);
    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(`Shader failed to compile: ${this.gl.getShaderInfoLog(shader)}`);
      console.log('Shader code:', shaderSource);
      return null;
    }
    return shader;
  }

  private sendVecAttribute(attrLocation: number, dimension: number, values: Float32Array): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.vertexAttribPointer(attrLocation, dimension, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(attrLocation);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, values, this.gl.DYNAMIC_DRAW);
  }

  private sendAttributes(): void {
    let windowCorners: Float32Array;
    let aWindowPosition: number;

    windowCorners = new Float32Array([-1,  1,
                                      -1, -1,
                                       1,  1,
                                       1, -1]);
    aWindowPosition = this.gl.getAttribLocation(this.shaderProgram, 'a_WindowPosition');
    this.sendVecAttribute(aWindowPosition, 2, windowCorners);
  }

  public loadShaders(): void {
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

  public render(): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.sendAttributes();
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
