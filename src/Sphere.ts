import Vector from './Vector';

export interface SphereInterface {
  radius: number;
  position: Vector;
  diffuseColor: number[];
}

export default class Sphere implements SphereInterface {
  public radius: number;
  public position: Vector;
  public diffuseColor: number[];

  constructor(params: SphereInterface) {
    this.radius = params.radius;
    this.position = params.position;
    this.diffuseColor = params.diffuseColor;
  }
}
