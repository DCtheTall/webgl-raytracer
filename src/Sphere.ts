import Vector from './Vector';

export interface SphereParameters {
  radius: number;
  position?: Vector;
  diffuseColor: number[];
  phongExponent: number;
  specularColor: number[];
  refractiveIndex?: number;
  reflectivity?: number;
  opacity?: number;
}

export default class Sphere {
  public radius: number;
  public position: Vector;
  public diffuseColor: number[];
  public phongExponent: number;
  public specularColor: number[];
  public refractiveIndex: number;
  public reflectivity: number;
  public opacity: number;

  constructor({
    radius,
    position = new Vector(0, 0, 0),
    diffuseColor,
    phongExponent,
    specularColor,
    refractiveIndex = 1.4,
    reflectivity = 0.5,
    opacity = 1,
  }: SphereParameters) {
    this.radius = radius;
    this.position = position;
    this.diffuseColor = diffuseColor;
    this.phongExponent = phongExponent;
    this.specularColor = specularColor;
    this.refractiveIndex = refractiveIndex;
    this.reflectivity = reflectivity;
    this.opacity = opacity;
  }
}
