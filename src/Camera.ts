import Vector from './Vector';

export default class Camera {
  private eye: Vector;
  private at: Vector;
  private up: Vector;
  private right: Vector;

  constructor() {
    this.eye = new Vector(0, 0, -1);
    this.at = new Vector(0, 0, 1);
    this.up = new Vector(0, 1, 0);
    this.right = Vector.cross(this.at, this.up);
  }

  public getCameraViewDirections(aspectRatio: number): Float32Array {
    let up: Vector;
    let viewDirection: Vector;
    let topLeft: Vector;
    let bottomLeft: Vector;
    let topRight: Vector;
    let bottomRight: Vector;

    up = Vector.scale(aspectRatio, this.up);
    viewDirection = Vector.normalize(Vector.subtract(this.at, this.eye));
    topLeft = Vector.add(
      viewDirection,
      Vector.normalize(Vector.subtract(up, this.right))
    );
    bottomLeft = Vector.add(
      viewDirection,
      Vector.normalize(Vector.scale(-1, Vector.add(up, this.right)))
    );
    topRight = Vector.add(
      viewDirection,
      Vector.normalize(Vector.add(up, this.right))
    );
    bottomRight = Vector.add(
      viewDirection,
      Vector.normalize(Vector.subtract(this.right, up))
    );
    return new Float32Array([
      ...Vector.normalize(topLeft).getElements(),
      ...Vector.normalize(bottomLeft).getElements(),
      ...Vector.normalize(topRight).getElements(),
      ...Vector.normalize(bottomRight).getElements(),
    ]);
  }

  public getEye(): Vector {
    return this.eye;
  }
}
