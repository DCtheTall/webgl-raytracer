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
  roughness?: number;
  reflectivity?: number;
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
  public roughness: number;
  public reflectivity: number;

  constructor(params: SphereParams) {
    this.position = params.pos;
    this.radius = params.radius;
    this.diffuse = params.diffuse;
    this.specular = params.specular === undefined?
      new Vector(0.9, 0.9, 0.9) : params.specular;
    this.roughness = params.roughness === undefined?
     250 : params.roughness;
    this.reflectivity = params.reflectivity === undefined?
      0.4 : params.reflectivity;
  }
}
