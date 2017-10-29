import Camera from './Camera';
import Light from './Light';
import Model from './Model';
import Sphere from './Sphere';
import Cube from './Cube';
import Vector from './Vector';

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

  private sendVectorAttribute(
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
    this.sendVectorAttribute(
      this.windowPositionBuffer,
      attribLocation,
      2,
      windowCorners
    );
    attribLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_CameraViewDirection');
    this.sendVectorAttribute(
      this.cameraViewDirectionBuffer,
      attribLocation,
      3,
      this.camera.getCameraViewDirections(this.aspectRatio)
    );
  }

  private sendFloatUniform(uniformName: string, value: number): void {
    let uniformLocation: WebGLUniformLocation;
    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, uniformName);
    this.gl.uniform1f(uniformLocation, value);
  }

  private sendVectorUniform(uniformName: string, value: number[]): void {
    let uniformLocation: WebGLUniformLocation;
    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, uniformName);
    this.gl.uniform3fv(uniformLocation, value);
  }

  private sendIntUniform(uniformName: string, value: number): void {
    let uniformLocation: WebGLUniformLocation;
    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, uniformName);
    this.gl.uniform1i(uniformLocation, value);
  }

  private sendMatrixUniform(uniformName: string, value: number[]): void {
    let uniformLocation: WebGLUniformLocation;
    uniformLocation = this.gl.getUniformLocation(this.shaderProgram, uniformName);
    this.gl.uniformMatrix3fv(uniformLocation, false, value);
  }

  private sendLightUniforms(light: Light, i: number): void {
    this.sendVectorUniform(`u_LightPositions[${i}]`, light.position.getElements());
    this.sendVectorUniform(`u_LightColors[${i}]`, light.color);
    this.sendFloatUniform(`u_LightIntensities[${i}]`, light.intensity);
  }

  private sendSphereUniforms(sphere: Sphere, i: number): void {
    if (!this.lastRender) {
      this.sendFloatUniform(`u_SphereRadii[${i}]`, sphere.radius);
      this.sendVectorUniform(`u_SphereDiffuseColors[${i}]`, sphere.diffuseColor);
      this.sendFloatUniform(`u_SpherePhongExponents[${i}]`, sphere.phongExponent);
      this.sendVectorUniform(`u_SphereSpecularColors[${i}]`, sphere.specularColor);
      this.sendFloatUniform(`u_SphereRefractiveIndexes[${i}]`, sphere.refractiveIndex);
      this.sendFloatUniform(`u_SphereReflectivities[${i}]`, sphere.reflectivity);
      this.sendFloatUniform(`u_SphereOpacities[${i}]`, sphere.opacity);
      this.sendIntUniform(`u_SphereUseTextures[${i}]`, +sphere.useTexture);

      if (sphere.useTexture) {
        if (!sphere.diffuseTexture) sphere.loadDiffuseTexture(this.gl);
        if (!sphere.specularTexture) sphere.loadSpecularTexture(this.gl);

        this.gl.activeTexture(<number>(<any>this.gl)[`TEXTURE${i}`]);
        this.gl.bindTexture(this.gl.TEXTURE_2D, sphere.diffuseTexture);
        this.sendIntUniform(`u_SphereDiffuseTextureSamplers[${i}]`, i);

        this.gl.activeTexture(<number>(<any>this.gl)[`TEXTURE${i + this.spheres.length}`]);
        this.gl.bindTexture(this.gl.TEXTURE_2D, sphere.specularTexture);
        this.sendIntUniform(`u_SphereSpecularTextureSamplers[${i}]`, i + this.spheres.length);
      }
    }

    this.sendVectorUniform(`u_SpherePositions[${i}]`, sphere.position.getElements());
    this.sendIntUniform(`u_SphereIsHoverings[${i}]`, +sphere.isHovering);
    this.sendMatrixUniform(`u_SphereRotations[${i}]`, sphere.getRotationMatrix());
  }

  private sendCubeUniform(cube: Cube, i: number): void {
    if (!this.lastRender) {
      this.sendVectorUniform(`u_CubeMinExtents[${i}]`, cube.minExtent.getElements());
      this.sendVectorUniform(`u_CubeMaxExtents[${i}]`, cube.maxExtent.getElements());
      this.sendVectorUniform(`u_CubeDiffuseColors[${i}]`, cube.diffuseColor);
      this.sendFloatUniform(`u_CubePhongExponents[${i}]`, cube.phongExponent);
      this.sendVectorUniform(`u_CubeSpecularColors[${i}]`, cube.specularColor);
      this.sendFloatUniform(`u_CubeRefractiveIndexes[${i}]`, cube.refractiveIndex);
      this.sendFloatUniform(`u_CubeReflectivities[${i}]`, cube.reflectivity);
    }

    this.sendMatrixUniform(`u_CubeRotationInverses[${i}]`, cube.getInverseRotationMatrix());
    this.sendVectorUniform(`u_CubePositions[${i}]`, cube.position.getElements());
    this.sendIntUniform(`u_CubeIsHoverings[${i}]`, +cube.isHovering);
  }

  private sendUniforms(): void {
    if (!this.lastRender) {
      this.sendVectorUniform('u_AmbientLightColor', this.ambientLightColor);

      if (this.lights.length > 8) throw new Error('Can only have up to 8 lights without modifying the fragment shader');
      this.sendIntUniform(`u_NumberOfLights`, this.lights.length);
      this.lights.forEach(this.sendLightUniforms.bind(this));
    }

    this.sendVectorUniform('u_CameraPosition', this.camera.eye.getElements());

    if (this.spheres.length > 8) throw new Error('You can only have up to 8 spheres without modifying the fragment shader');
    this.sendIntUniform('u_NumberOfSpheres', this.spheres.length);
    this.spheres.forEach(this.sendSphereUniforms.bind(this));

    if (this.cubes.length > 8) throw new Error('You can only have up to 8 cubes without modifiying the fragment shader');
    this.sendIntUniform('u_NumberOfCubes', this.cubes.length);
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
