import Vector from './Vector';

export interface CubeParameters {
  x: number;
  y: number;
  z: number;
  diffuseColor: number[];
  phongExponent: number;
  specularColor: number[];
}

export default class Cube {
  public minExtent: Vector;
  public maxExtent: Vector;
  public thetaY: number;
  public diffuseColor: number[];
  public phongExponent: number;
  public specularColor: number[];

  constructor({
    x,
    y,
    z,
    diffuseColor,
    phongExponent,
    specularColor,
  }: CubeParameters) {
    this.minExtent = new Vector(-(x / 2), 0, -(z / 2));
    this.maxExtent = new Vector((x / 2), y, (z / 2));
    this.thetaY = 0;
    this.diffuseColor = diffuseColor;
    this.phongExponent = phongExponent;
    this.specularColor = specularColor;
  }
}
