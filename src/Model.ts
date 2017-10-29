import Vector from './Vector';
import Quaternion from './Quaternion';

export interface ModelParameters {
  position?: Vector;
  diffuseColor: number[];
  phongExponent: number;
  specularColor: number[];
  refractiveIndex?: number;
  reflectivity?: number;
  rotation?: Quaternion;
}

export default class Model implements ModelParameters {
  public position: Vector;
  public diffuseColor: number[];
  public phongExponent: number;
  public specularColor: number[];
  public refractiveIndex: number;
  public reflectivity: number;
  public isHovering: boolean;
  public rotation: Quaternion;

  constructor({
    position = new Vector(0, 0, 0),
    diffuseColor,
    phongExponent,
    specularColor,
    rotation,
    refractiveIndex = 1.4,
    reflectivity = 0.5,
  }: ModelParameters) {
    this.position = position;
    this.diffuseColor = diffuseColor;
    this.phongExponent = phongExponent;
    this.specularColor = specularColor;
    this.refractiveIndex = refractiveIndex;
    this.reflectivity = reflectivity;
    this.isHovering = false;
    this.rotation = rotation;
  }
}
