import Vector from './Vector';
import Model, { ModelParameters } from './Model';
import { isImagePowerOfTwo } from './lib/helpers';

export interface SphereParameters extends ModelParameters {
  radius: number;
  position?: Vector;
  opacity?: number;
  useTexture?: boolean;
}

export default class Sphere extends Model {
  private diffuseTextureImage: HTMLImageElement;
  private specularTextureImage: HTMLImageElement;

  public radius: number;
  public position: Vector;
  public diffuseColor: number[];
  public phongExponent: number;
  public specularColor: number[];
  public refractiveIndex: number;
  public reflectivity: number;
  public opacity: number;
  public useTexture: boolean;
  public diffuseTexture: WebGLTexture;
  public specularTexture: WebGLTexture;

  constructor({
    radius,
    opacity = 1,
    useTexture = false,
    ...modelParameters,
  }: SphereParameters) {
    super(modelParameters);
    this.radius = radius;
    this.opacity = opacity;
    this.useTexture = useTexture;
  }

  static loadTexture(gl: WebGLRenderingContext, image: HTMLImageElement): WebGLTexture {
    let texture: WebGLTexture;
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    return texture;
  }

  public loadDiffuseTexture(gl: WebGLRenderingContext): void {
    this.diffuseTexture = Sphere.loadTexture(gl, this.diffuseTextureImage);
  }

  public loadSpecularTexture(gl: WebGLRenderingContext): void {
    this.specularTexture = Sphere.loadTexture(gl, this.specularTextureImage);
  }

  public setTextureImages(
    diffuseImage: HTMLImageElement,
    specularImage: HTMLImageElement
  ): Sphere {
    if (!isImagePowerOfTwo(diffuseImage) || !isImagePowerOfTwo(specularImage)) {
      throw new Error('Texture images must have dimensions that are powers of 2');
    }
    this.diffuseTextureImage = diffuseImage;
    this.specularTextureImage = specularImage;
    return this;
  }
}
