"use strict";
var Vector_1 = require("./Vector");
var Camera = (function () {
    function Camera(pos, lookAt) {
        this.pos = pos;
        var down;
        down = new Vector_1.default(0, -1, 0);
        this.forward = Vector_1.default.normalize(Vector_1.default.subtract(lookAt, this.pos));
        this.right = Vector_1.default.normalize(Vector_1.default.cross(down, this.forward));
        this.up = Vector_1.default.normalize(Vector_1.default.cross(this.right, this.forward));
    }
    Camera.prototype.zoom = function (k) {
        this.right = Vector_1.default.scale(k, this.right);
        this.up = Vector_1.default.scale(k, this.right);
    };
    return Camera;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Camera;
//# sourceMappingURL=Camera.js.map