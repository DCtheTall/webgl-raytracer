import Vector from './Vector';
import Quaternion from './Quaternion';
import Model, { ModelParameters } from './Model';

export interface CubeParameters extends ModelParameters {
  minExtent: Vector;
  maxExtent: Vector;
}

export default class Cube extends Model {
  public minExtent: Vector;
  public maxExtent: Vector;
  public position: Vector;
  public diffuseColor: number[];
  public phongExponent: number;
  public specularColor: number[];
  public refractiveIndex: number;
  public reflectivity: number;

  constructor({
    minExtent,
    maxExtent,
    reflectivity = 0.1,
    ...modelParameters,
  }: CubeParameters) {
    super(modelParameters);
    this.minExtent = minExtent;
    this.maxExtent = maxExtent;
    this.reflectivity = reflectivity;
  }

  public getInverseRotationMatrix(): number[] {
    if (!this.rotation) {
      return [1, 0, 0,
              0, 1, 0,
              0, 0, 1];
    }
    return this.rotation.getInverseRotationMatrixElements();
  }

  public rotateOnAxis(theta: number, axis: Vector): Cube {
    let v: Vector;
    v = Vector.scale(Math.sin(theta / 2), Vector.normalize(axis));
    this.rotation = new Quaternion(Math.cos(theta / 2), v.x, v.y, v.z);
    return this;
  }
}
