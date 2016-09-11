/*

WebGL Raytracer
---------------

Light object:
- contains information that will be passed to the GPU for each light source

*/

import Vector from "./Vector";

/*
* Interface for the argument of the object's constructor
* contains params for the object
*
* @interface LightParams
*/
export interface LightParams {
  pos: Vector;
  color: Vector;
  intensity: number;
}

/*
* This class will send info about a light source to the GPU
*
* @class Light
*/
export default class Light {
  public position: Vector;
  public color: Vector;
  public intensity: number;

  constructor(params: LightParams) {
    this.position = params.pos;
    this.color = params.color;
    this.intensity = params.intensity;
  }
}
