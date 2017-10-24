import Vector from './Vector';

export interface SphereParameters {
  radius: number;
  position?: Vector;
  diffuseColor: number[];
  phongExponent: number;
  specularColor: number[];
  refractiveIndex?: number;
}

export default class Sphere {
  public radius: number;
  public position: Vector;
  public diffuseColor: number[];
  public phongExponent: number;
  public specularColor: number[];
  public refractiveIndex: number;

  constructor({
    radius,
    position = new Vector(0, 0, 0),
    diffuseColor,
    phongExponent,
    specularColor,
    refractiveIndex = 1.3,
  }: SphereParameters) {
    this.radius = radius;
    this.position = position;
    this.diffuseColor = diffuseColor;
    this.phongExponent = phongExponent;
    this.specularColor = specularColor;
  }
}
