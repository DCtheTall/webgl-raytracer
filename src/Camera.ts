import Vector from './Vector';

export default class Camera {
  private lookAt: Vector;
  private right: Vector;

  public eye: Vector;
  public viewDirection: Vector;

  constructor(eye: Vector, lookAt: Vector) {
    this.eye = eye;
    this.lookAt = lookAt;
    this.viewDirection = Vector.normalize(Vector.subtract(lookAt, eye));
  }

  public calculateViewDirection(): void {
    this.viewDirection = Vector.normalize(Vector.subtract(this.lookAt, this.eye));
  }

  public getCameraViewDirections(aspectRatio: number): Float32Array {
    let down: Vector;
    let right: Vector;
    let up: Vector;
    let topLeft: Vector;
    let bottomLeft: Vector;
    let topRight: Vector;
    let bottomRight: Vector;

    down = new Vector(0, -1, 0);
    right = Vector.normalize(Vector.cross(down, this.viewDirection));
    up = Vector.normalize(Vector.cross(right, this.viewDirection));
    topLeft = Vector.add(
      this.viewDirection,
      Vector.subtract(up, Vector.scale(aspectRatio, right))
    );
    bottomLeft = Vector.subtract(
      this.viewDirection,
      Vector.add(up, Vector.scale(aspectRatio, right))
    );
    topRight = Vector.add(
      this.viewDirection,
      Vector.add(up, Vector.scale(aspectRatio, right))
    );
    bottomRight = Vector.add(
      this.viewDirection,
      Vector.subtract(Vector.scale(aspectRatio, right), up)
    );

    return new Float32Array([
      ...Vector.normalize(topLeft).getElements(),
      ...Vector.normalize(bottomLeft).getElements(),
      ...Vector.normalize(topRight).getElements(),
      ...Vector.normalize(bottomRight).getElements(),
    ]);
  }
}
