"use strict";
var Vector_1 = require("./Vector");
var Sphere = (function () {
    function Sphere(params) {
        this.position = params.pos;
        this.radius = params.radius;
        this.diffuse = params.diffuse;
        this.specular = params.specular === undefined ?
            new Vector_1.default(0.9, 0.9, 0.9) : params.specular;
        this.shininess = params.shininess === undefined ?
            250 : params.shininess;
        this.refractiveIndex = params.refractiveIndex === undefined ?
            1.4 : params.refractiveIndex;
        this.opacity = params.opacity === undefined ?
            1 : params.opacity;
    }
    return Sphere;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sphere;
//# sourceMappingURL=Sphere.js.map