/*

WebGL Raytracer
---------------

Vector object
- vector operations
- push components to an array

*/

import Quaternion from "./Quaternion";

export default class Vector {
  constructor(public x: number,
              public y: number,
              public z: number) {}

  public set(x: number, y: number, z: number) {
    this.x = x; this.y = y; this.z = z;
  }

  static scale(k: number, v: Vector): Vector {
    return new Vector(k*v.x, k*v.y, k*v.z)
  }
  static add(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x+v2.x, v1.y+v2.y, v1.z+v2.z);
  }
  static subtract(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x-v2.x, v1.y-v2.y, v1.z-v2.z);
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
  static rotate(v: Vector, theta: number, axis: Vector): Vector {
    let p: Quaternion;
    let u: Vector;
    let q: Quaternion;
    p = new Quaternion(0, v.x, v.y, v.z);
    u = Vector.scale(Math.sin(theta / 2), Vector.normalize(axis));
    q = new Quaternion(Math.cos(theta / 2), u.x, u.y, u.z);
    p = Quaternion.multiply(p, q.conjugate());
    p = Quaternion.multiply(q, p);
    return new Vector(p.i, p.j, p.k);
  }
  static push(v: Vector, array: number[]): number[] {
    array.push(v.x, v.y, v.z);
    return array;
  }
}
