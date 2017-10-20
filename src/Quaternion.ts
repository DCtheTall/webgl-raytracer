export default class Quaternion {
  constructor(public r: number,
              public i: number,
              public j: number,
              public k: number) {}

  public conjugate() {
    return new Quaternion(this.r, -this.i, -this.j, -this.k);
  }

  static multiply(q1: Quaternion, q2: Quaternion) {
    return new Quaternion((q1.r * q1.r) - (q1.i * q2.i) - (q1.j * q2.j) - (q1.k * q2.k),
                          (q1.r * q2.i) + (q1.i * q2.r) + (q1.j * q2.k) - (q1.k * q2.j),
                          (q1.r * q2.j) - (q1.i * q2.k) + (q1.j * q2.r) + (q1.k * q2.i),
                          (q1.r * q2.k) + (q1.i * q2.j) - (q1.j * q2.i) + (q1.k * q2.r));
  }
}
