import Vector from './Vector';

export default class Camera {
  private eye: Vector;
  private viewDirection: Vector;
  private up: Vector;
  private right: Vector;
  private fov: number;

  constructor() {
    this.eye = new Vector(0, 1.2, 2);
    this.viewDirection = Vector.normalize(new Vector(0, -.2, -1));
    this.up = new Vector(0, 1, 0);
    this.fov = Math.PI / 4;
  }

  public getCameraViewPositions(aspectRatio: number): Float32Array {
    let lookAt: Vector;
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

    lookAt = Vector.add(this.eye, this.viewDirection);
    u = Vector.normalize(Vector.cross(this.viewDirection, this.up));
    v = Vector.normalize(Vector.cross(u, this.viewDirection));
    viewPlaneHalfWidth = Math.tan(this.fov / 2);
    viewPlaneHalfHeight = viewPlaneHalfWidth ;
    right = Vector.scale(viewPlaneHalfWidth, u);
    up = Vector.scale(viewPlaneHalfHeight, v);
    topLeft = Vector.add(
      lookAt,
      Vector.subtract(up, right)
    );
    bottomLeft = Vector.subtract(
      lookAt,
      Vector.add(up, right)
    );
    topRight = Vector.add(
      lookAt,
      Vector.add(up, right)
    );
    bottomRight = Vector.add(
      lookAt,
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

    u = Vector.normalize(Vector.cross(this.viewDirection, this.up));
    v = Vector.normalize(Vector.cross(u, this.viewDirection));
    viewPlaneHalfWidth = 1 / 2;
    viewPlaneHalfHeight = viewPlaneHalfWidth / aspectRatio;
    right = Vector.scale(2 * viewPlaneHalfWidth, u);
    up = Vector.scale(2 * viewPlaneHalfHeight, v);
    topLeft = Vector.add(
      this.viewDirection,
      Vector.subtract(up, right)
    );
    bottomLeft = Vector.subtract(
      this.viewDirection,
      Vector.add(up, right)
    );
    topRight = Vector.add(
      this.viewDirection,
      Vector.add(up, right)
    );
    bottomRight = Vector.add(
      this.viewDirection,
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
