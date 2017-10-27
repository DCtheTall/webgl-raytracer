import Vector from './Vector';
import Model, { ModelParameters } from './Model';

export interface SphereParameters extends ModelParameters {
  radius: number;
  position?: Vector;
  opacity?: number;
}

export default class Sphere extends Model {
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
    opacity = 1,
    ...modelParameters,
  }: SphereParameters) {
    super(modelParameters);
    this.radius = radius;
    this.opacity = opacity;
  }
}
