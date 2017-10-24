export default class Quaternion {
  constructor(public r: number,
              public i: number,
              public j: number,
              public k: number) {}

  static mag(q: Quaternion): number {
    return ((q.r ** 2) - ((q.i ** 2) + (q.j ** 2) + (q.k ** 2))) ** 0.5;
  }

  static multiply(q1: Quaternion, q2: Quaternion) {
    return new Quaternion((q1.r * q1.r) - (q1.i * q2.i) - (q1.j * q2.j) - (q1.k * q2.k),
                          (q1.r * q2.i) + (q1.i * q2.r) + (q1.j * q2.k) - (q1.k * q2.j),
                          (q1.r * q2.j) - (q1.i * q2.k) + (q1.j * q2.r) + (q1.k * q2.i),
                          (q1.r * q2.k) + (q1.i * q2.j) - (q1.j * q2.i) + (q1.k * q2.r));
  }

  static versor(q: Quaternion): Quaternion {
    let mag: number;
    mag = Quaternion.mag(q);
    if (mag === 0) throw new Error('Cannot make a quaternion with magnitude zero a versor');
    return new Quaternion((q.r / mag), (q.i / mag), (q.j / mag), (q.k / mag));
  }

  public conjugate() {
    return new Quaternion(this.r, -this.i, -this.j, -this.k);
  }

  public getAsRotationMatrixElements(): number[] {
    let q: Quaternion;
    let s: number;
    q = this;
    s = 2 / (Quaternion.mag(this) ** 2);
    return [
      1 - (s * ((q.j ** 2) + (q.k ** 2))),
      s * ((q.i * q.j) + (q.k * q.r)),
      s * ((q.i * q.k) - (q.j * q.r)), // first column
      s * ((q.i * q.j) - (q.k * q.r)),
      1 - (s * ((q.i ** 2) + (q.k ** 2))),
      s * ((q.j * q.k) + (q.i * q.r)), // second column
      s * ((q.i * q.k) + (q.j * q.r)),
      s * ((q.j * q.k) - (q.i * q.r)),
      1 - (s * ((q.i ** 2) + (q.j ** 2))), // third column
    ];
  }
}
