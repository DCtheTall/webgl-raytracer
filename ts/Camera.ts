/*

WebGL Raytracer
---------------

Camera object:
- has public vector classes for raytracer

*/

import Vector from "./Vector";

class Camera {
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

  // Zoom camera in or out
  // a number >1 zooms the camera out k times
  // a number <1 zooms the camera in 1/k times
  public zoom(k: number) {
    this.right = Vector.scale(k, this.right);
    this.up = Vector.scale(k, this.right);
  }
}
export default Camera;
