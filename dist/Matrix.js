"use strict";
var Vector_1 = require("./Vector");
var Matrix = (function () {
    function Matrix(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        this.row1 = new Vector_1.default(x1, x2, x3);
        this.row2 = new Vector_1.default(y1, y2, y3);
        this.row3 = new Vector_1.default(z1, z2, z3);
    }
    Matrix.multiply = function (M, v) {
        var quaternion;
        quaterinion = {};
        return new Vector_1.default(Vector_1.default.dot(M.row1, v), Vector_1.default.dot(M.row2, v), Vector_1.default.dot(M.row3, v));
    };
    Matrix.rotateOnAxis = function (theta, axis) {
        return new Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1);
    };
    return Matrix;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Matrix;
//# sourceMappingURL=Matrix.js.map