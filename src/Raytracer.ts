import Camera from './Camera';
import Light from './Light';
import Model from './Model';
import Sphere from './Sphere';
import Cube from './Cube';
import Vector from './Vector';

// TODO optimize render by only updating color that change

export default class Raytracer {
  private FRAME_RATE = 10;

  private aspectRatio: number;
  private gl: WebGLRenderingContext;
  private windowPositionBuffer: WebGLBuffer;
  private cameraViewDirectionBuffer: WebGLBuffer;
  private shaderProgram: WebGLProgram;
  private ambientLightColor: number[];
  private rendering: boolean;
  private lastRender: number;
  private renderHasThrownError: boolean;

  public canvas: HTMLCanvasElement;
  public camera: Camera;
  public lights: Light[];
  public spheres: Sphere[];
  public cubes: Cube[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.aspectRatio = canvas.width / canvas.height;
    this.gl = <WebGLRenderingContext>canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.clearColor(0, 0, 0, 1);
    this.windowPositionBuffer = this.gl.createBuffer();
    this.cameraViewDirectionBuffer = this.gl.createBuffer();
    this.ambientLightColor = [.2, .2, .2];
    this.lights = [];
    this.spheres = [];
    this.cubes = [];
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
    attribLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_CameraViewDirection');
    this.sendVecAttribute(
      this.cameraViewDirectionBuffer,
      attribLocation,
      3,
      this.camera.getCameraViewDirections(this.aspectRatio)
    );
  }

  private sendLightUniforms(light: Light, i: number): void {
    let uniformLocation: WebGLUniformLocation;

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_LightPositions[${i}]`);
    this.gl.uniform3fv(uniformLocation, light.position.getElements());

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_LightColors[${i}]`);
    this.gl.uniform3fv(uniformLocation, light.color);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_LightIntensities[${i}]`);
    this.gl.uniform1f(uniformLocation, light.intensity);
  }

  private sendSphereUniforms(sphere: Sphere, i: number): void {
    let uniformLocation: WebGLUniformLocation;

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

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_SphereRefractiveIndexes[${i}]`);
    this.gl.uniform1f(uniformLocation, sphere.refractiveIndex);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_SphereReflectivities[${i}]`);
    this.gl.uniform1f(uniformLocation, sphere.reflectivity);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_SphereOpacities[${i}]`);
    this.gl.uniform1f(uniformLocation, sphere.opacity);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_SphereUseTextures[${i}]`);
    this.gl.uniform1i(uniformLocation, +sphere.useTexture);

    if (sphere.useTexture) {
      if (!sphere.diffuseTexture) sphere.loadDiffuseTexture(this.gl);
      if (!sphere.specularTexture) sphere.loadSpecularTexture(this.gl);

      uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_SphereDiffuseTextureSamplers[${i}]`);
      this.gl.activeTexture(<number>(<any>this.gl)[`TEXTURE${i}`]);
      this.gl.bindTexture(this.gl.TEXTURE_2D, sphere.diffuseTexture);
      this.gl.uniform1i(uniformLocation, i);

      uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_SphereSpecularTextureSamplers[${i}]`);
      this.gl.activeTexture(<number>(<any>this.gl)[`TEXTURE${i + this.spheres.length}`]);
      this.gl.bindTexture(this.gl.TEXTURE_2D, sphere.specularTexture);
      this.gl.uniform1i(uniformLocation, i);
    }

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_SphereIsHoverings[${i}]`);
    this.gl.uniform1i(uniformLocation, +sphere.isHovering);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_SphereRotations[${i}]`);
    this.gl.uniformMatrix3fv(uniformLocation, false, sphere.getRotationMatrix());
  }

  private sendCubeUniform(cube: Cube, i: number): void {
    let uniformLocation: WebGLUniformLocation;

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_CubeMinExtents[${i}]`);
    this.gl.uniform3fv(uniformLocation, cube.minExtent.getElements());

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_CubeMaxExtents[${i}]`);
    this.gl.uniform3fv(uniformLocation, cube.maxExtent.getElements());

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_CubeRotationInverses[${i}]`);
    this.gl.uniformMatrix3fv(uniformLocation, false, cube.getInverseRotationMatrix());

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_CubePositions[${i}]`);
    this.gl.uniform3fv(uniformLocation, cube.position.getElements());

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_CubeDiffuseColors[${i}]`);
    this.gl.uniform3fv(uniformLocation, cube.diffuseColor);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_CubePhongExponents[${i}]`);
    this.gl.uniform1f(uniformLocation, cube.phongExponent);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_CubeSpecularColors[${i}]`);
    this.gl.uniform3fv(uniformLocation, cube.specularColor);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_CubeRefractiveIndexes[${i}]`);
    this.gl.uniform1f(uniformLocation, cube.refractiveIndex);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_CubeReflectivities[${i}]`);
    this.gl.uniform1f(uniformLocation, cube.reflectivity);

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_CubeIsHoverings[${i}]`);
    this.gl.uniform1i(uniformLocation, +cube.isHovering);
  }

  private sendUniforms(): void {
    let uniformLocation: WebGLUniformLocation;

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_CameraPosition');
    this.gl.uniform3fv(uniformLocation, this.camera.eye.getElements());

    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_AmbientLightColor');
    this.gl.uniform3fv(uniformLocation, this.ambientLightColor);

    if (this.lights.length > 8) throw new Error('Can only have up to 8 lights without modifying the fragment shader');
    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, `u_NumberOfLights`);
    this.gl.uniform1i(uniformLocation, this.lights.length);

    this.lights.forEach(this.sendLightUniforms.bind(this));

    if (this.spheres.length > 8) throw new Error('You can only have up to 8 spheres without modifying the fragment shader');
    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_NumberOfSpheres');
    this.gl.uniform1i(uniformLocation, this.spheres.length);

    this.spheres.forEach(this.sendSphereUniforms.bind(this));

    if (this.cubes.length > 8) throw new Error('You can only have up to 8 cubes without modifiying the fragment shader');
    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_NumberOfCubes');
    this.gl.uniform1i(uniformLocation, this.cubes.length);

    this.cubes.forEach(this.sendCubeUniform.bind(this));
  }

  public render(): void {
    try {
      if (!this.shaderProgram && !this.renderHasThrownError) this.createShaderProgram();
      if (!this.rendering
          && !this.renderHasThrownError
          && (
        !this.lastRender
        || Date.now() - this.lastRender > 1000 / this.FRAME_RATE
      )) {
        this.rendering = true;

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.sendAttributes();
        this.sendUniforms();
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        this.rendering = false;
        this.lastRender = Date.now();
      }
    } catch(err) {
      this.renderHasThrownError = true;
    }
  }
}
