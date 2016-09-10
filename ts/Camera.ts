/*

WebGL Raytracer
---------------

Camera object:
- has public vector classes for raytracer

*/

import Vector from "./Vector";

export default class Camera {
  public forward: Vector;
  public right: Vector;
  public up: Vector;

  constructor(public pos: Vector, lookAt: Vector) {
    let down: Vector;
    down = new Vector(0, -1, 0);
    this.forward = Vector.normalize(Vector.subtract(lookAt, this.pos));
    this.right = Vector.normalize(Vector.cross(down, this.forward));
    this.up = Vector.normalize(Vector.cross(this.right, this.forward));
  }
}
