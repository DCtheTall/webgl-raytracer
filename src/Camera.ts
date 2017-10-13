import Vector from './Vector';

export default class Camera {
  private eye: Vector;
  private at: Vector;
  private up: Vector;
  private right: Vector;

  constructor() {
    this.eye = new Vector(0, 0, 0);
    this.at = new Vector(0, 0, 1);
    this.up = new Vector(0, 1, 0);
    this.right = Vector.cross(this.at, this.up);
  }

  // TODO methods
}
