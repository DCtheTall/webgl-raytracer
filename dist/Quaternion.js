"use strict";
var Quaternion = (function () {
    function Quaternion(r, i, j, k) {
        this.r = r;
        this.i = i;
        this.j = j;
        this.k = k;
    }
    Quaternion.prototype.conjugate = function () {
        return new Quaternion(this.r, -this.i, -this.j, -this.k);
    };
    Quaternion.multiply = function (q1, q2) {
        return new Quaternion(q1.r * q1.r - q1.i * q2.i - q1.j * q2.j - q1.k * q2.k, q1.r * q2.i + q1.i * q2.r + q1.j * q2.k - q1.k * q2.j, q1.r * q2.j - q1.i * q2.k + q1.j * q2.r + q1.k * q2.i, q1.r * q2.k + q1.i * q2.j - q1.j * q2.i + q1.k * q2.r);
    };
    return Quaternion;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Quaternion;
//# sourceMappingURL=Quaternion.js.map