import axios, { AxiosResponse } from 'axios';

export default class Raytracer {
  private ASPECT_RATIO: number;

  private gl: WebGLRenderingContext;

  constructor(canvas: HTMLCanvasElement) {
    this.ASPECT_RATIO = canvas.width / canvas.height;
    this.gl = <WebGLRenderingContext>canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.clearColor(0, 0, 0, 1);
    // TODO init camera
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

  public loadShaders(): Promise<WebGLProgram> {
    let vertexShaderSource: string;

    return axios.get('/shaders/vertex.glsl').then((res: AxiosResponse) => {
      vertexShaderSource = <string>res.data;
      return axios.get('/shaders/fragment.glsl');
    })
    .then((res: AxiosResponse) => {
      let fragmentShaderSource: string;
      let vertexShader: WebGLShader;
      let fragmentShader: WebGLShader;
      let shaderProgram: WebGLProgram;

      fragmentShaderSource = <string>res.data;
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
      return shaderProgram;
    });
  }
}
