"use strict";
var Vector_1 = require("./Vector");
var Sphere = (function () {
    function Sphere(params) {
        this.position = params.pos;
        this.radius = params.radius;
        this.diffuse = params.diffuse;
        this.specular = params.specular === undefined ?
            new Vector_1.default(0.9, 0.9, 0.9) : params.specular;
        this.roughness = params.roughness === undefined ?
            250 : params.roughness;
        this.reflectivity = params.reflectivity === undefined ?
            0.4 : params.reflectivity;
    }
    return Sphere;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sphere;
//# sourceMappingURL=Sphere.js.map