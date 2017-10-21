import Vector from './Vector';

export interface SphereParameters {
  radius: number;
  position: Vector;
  diffuseColor: number[];
  phongExponent: number;
  specularColor: number[];
}

export default class Sphere {
  public radius: number;
  public position: Vector;
  public diffuseColor: number[];
  public phongExponent: number;
  public specularColor: number[];

  constructor({
    radius,
    position,
    diffuseColor,
    phongExponent,
    specularColor,
  }: SphereParameters) {
    this.radius = radius;
    this.position = position;
    this.diffuseColor = diffuseColor;
    this.phongExponent = phongExponent;
    this.specularColor = specularColor;
  }
}
