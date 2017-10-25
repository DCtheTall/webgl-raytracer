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

  public conjugate() {
    return new Quaternion(this.r, -this.i, -this.j, -this.k);
  }

  public getAsRotationMatrixElements(): number[] {
    let q: Quaternion;
    q = this;
    return [
      1 - (2 * ((q.j ** 2) + (q.k ** 2))),
      2 * ((q.i * q.j) + (q.k * q.r)),
      2 * ((q.i * q.k) - (q.j * q.r)), // first column
      2 * ((q.i * q.j) - (q.k * q.r)),
      1 - (2 * ((q.i ** 2) + (q.k ** 2))),
      2 * ((q.j * q.k) + (q.i * q.r)), // second column
      2 * ((q.i * q.k) + (q.j * q.r)),
      2 * ((q.j * q.k) - (q.i * q.r)),
      1 - (2 * ((q.i ** 2) + (q.j ** 2))), // third column
    ];
  }
}
