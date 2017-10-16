import Vector from './Vector';

export default class Camera {
  private eye: Vector;
  private at: Vector;
  private up: Vector;
  private right: Vector;
  private fov: number;

  constructor() {
    this.eye = new Vector(2, 2.5, 5);
    this.at = new Vector(0, 2, 0);
    this.up = new Vector(0, 1, 0);
    this.fov = Math.PI / 4;
  }

  public getCameraViewPositions(aspectRatio: number): Float32Array {
    let viewDirection: Vector;
    let u: Vector;
    let v: Vector;
    let viewPlaneHalfWidth: number;
    let viewPlaneHalfHeight: number;
    let right: Vector;
    let up: Vector;
    let topLeft: Vector;
    let bottomLeft: Vector;
    let topRight: Vector;
    let bottomRight: Vector;

    viewDirection = Vector.subtract(this.at, this.eye);
    u = Vector.normalize(Vector.cross(viewDirection, this.up));
    v = Vector.normalize(Vector.cross(u, viewDirection));
    viewPlaneHalfWidth = Math.tan(this.fov / 2);
    viewPlaneHalfHeight = viewPlaneHalfWidth / aspectRatio;
    right = Vector.scale(viewPlaneHalfWidth, u);
    up = Vector.scale(viewPlaneHalfHeight, v);
    topLeft = Vector.add(
      this.at,
      Vector.subtract(up, right)
    );
    bottomLeft = Vector.subtract(
      this.at,
      Vector.add(up, right)
    );
    topRight = Vector.add(
      this.at,
      Vector.add(up, right)
    );
    bottomRight = Vector.add(
      this.at,
      Vector.subtract(right, up)
    );

    return new Float32Array([
      ...topLeft.getElements(),
      ...bottomLeft.getElements(),
      ...topRight.getElements(),
      ...bottomRight.getElements(),
    ]);
  }

  public getCameraViewDirections(aspectRatio: number): Float32Array {
    let viewDirection: Vector;
    let u: Vector;
    let v: Vector;
    let viewPlaneHalfWidth: number;
    let viewPlaneHalfHeight: number;
    let right: Vector;
    let up: Vector;
    let topLeft: Vector;
    let bottomLeft: Vector;
    let topRight: Vector;
    let bottomRight: Vector;

    viewDirection = Vector.subtract(this.at, this.eye);
    u = Vector.normalize(Vector.cross(viewDirection, this.up));
    v = Vector.normalize(Vector.cross(u, viewDirection));
    viewPlaneHalfWidth = Math.tan(this.fov / 2);
    viewPlaneHalfHeight = viewPlaneHalfWidth / aspectRatio;
    right = Vector.scale(2 * viewPlaneHalfWidth, u);
    up = Vector.scale(2 * viewPlaneHalfHeight, v);
    topLeft = Vector.add(
      viewDirection,
      Vector.subtract(up, right)
    );
    bottomLeft = Vector.subtract(
      viewDirection,
      Vector.add(up, right)
    );
    topRight = Vector.add(
      viewDirection,
      Vector.add(up, right)
    );
    bottomRight = Vector.add(
      viewDirection,
      Vector.subtract(right, up)
    );

    return new Float32Array([
      ...Vector.normalize(topLeft).getElements(),
      ...Vector.normalize(bottomLeft).getElements(),
      ...Vector.normalize(topRight).getElements(),
      ...Vector.normalize(bottomRight).getElements(),
    ]);
  }

  getEye(): Vector {
    return this.eye;
  }
}
