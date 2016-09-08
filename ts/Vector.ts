/*

WebGL Raytracer
---------------

Vector object
- vector operations
- push components to an array

*/

class Vector {
  constructor(public x: number,
              public y: number,
              public z: number) {}

  static scale(k: number, v: Vector): Vector {
    return new Vector(k*v.x, k*v.y, k*v.z)
  }
  static mag(v: Vector): number {
    return Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
  }
  static normalize(v: Vector): Vector {
    let mag: number;
    let div: number;
    mag = Vector.mag(v);
    if(mag === 0) {
      console.log('Cannot normalize zero vector');
      return null;
    }
    div = 1/mag;
    return Vector.scale(div, v);
  }
  static cross(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.y * v2.z - v1.z * v2.y,
                      v1.z * v2.x - v1.x * v2.z,
                      v1.x * v2.y - v1.y * v2.x);
  }
  static push(v: Vector, array: number[]): void {
    array.push(v.x, v.y, v.z);
  }
}
export default Vector;