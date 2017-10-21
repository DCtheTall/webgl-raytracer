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
  private thetaY: number;

  public minExtent: Vector;
  public maxExtent: Vector;
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

  public rotateY(theta: number): void {
    this.thetaY = theta;
  }

  public getInverseRotationMatrix(): number[] {
    let sin: number;
    let cos: number;
    sin = Math.sin(-this.thetaY);
    cos = Math.cos(this.thetaY);
    return [cos, 0, -sin,
              0, 1,    0,
            sin, 0,  cos];
  }
}
