/*

WebGL Raytracer
---------------

Sphere object:
- contains information that will be passed to the GPU for each sphere object

*/

import Vector from "./Vector";

/*
* Parameters for the sphere constructor
*
* @interface SphereParams
*/
export interface SphereParams {
  pos: Vector;
  radius: number;
  diffuse: Vector;
  specular?: Vector;
  shininess?: number;
  reflectivity?: number;
  refractiveIndex?: number;
  opacity?: number;
}

/*
* Sphere object
*
* @class Sphere
*/
export default class Sphere {
  public position: Vector;
  public radius: number;
  public diffuse: Vector;
  public specular: Vector;
  public shininess: number;
  public reflectivity: number;
  public refractiveIndex: number;
  public opacity: number;

  constructor(params: SphereParams) {
    this.position = params.pos;
    this.radius = params.radius;
    this.diffuse = params.diffuse;
    this.specular = params.specular === undefined?
      new Vector(0.9, 0.9, 0.9) : params.specular;
    this.shininess = params.shininess === undefined?
     250 : params.shininess;
    this.refractiveIndex = params.refractiveIndex === undefined?
      1.4 : params.refractiveIndex;
    this.opacity = params.opacity === undefined?
      1 : params.opacity
  }
}
