import Vector from './Vector';

export interface ModelParameters {
  position?: Vector;
  diffuseColor: number[];
  phongExponent: number;
  specularColor: number[];
  refractiveIndex?: number;
  reflectivity?: number;
}

export default class Model {
  private originalDiffuseColor: number[];
  private originalSpecularColor: number[];

  public position: Vector;
  public diffuseColor: number[];
  public phongExponent: number;
  public specularColor: number[];
  public refractiveIndex: number;
  public reflectivity: number;
  public opacity: number;
  public isHovering: boolean;

  constructor({
    position = new Vector(0, 0, 0),
    diffuseColor,
    phongExponent,
    specularColor,
    refractiveIndex = 1.4,
    reflectivity = 0.5,
  }: ModelParameters) {
    this.position = position;
    this.diffuseColor = diffuseColor;
    this.originalDiffuseColor = diffuseColor;
    this.phongExponent = phongExponent;
    this.specularColor = specularColor;
    this.originalSpecularColor = specularColor;
    this.refractiveIndex = refractiveIndex;
    this.reflectivity = reflectivity;
    this.isHovering = false;
  }
}
