"use strict";
var Raytracer_1 = require("./Raytracer");
var Vector_1 = require("./Vector");
var Light_1 = require("./Light");
var Sphere_1 = require("./Sphere");
function main() {
    var canvas;
    var raytracer;
    canvas = document.createElement("canvas");
    canvas.width = 700;
    canvas.height = 500;
    document.getElementById('container').appendChild(canvas);
    raytracer = new Raytracer_1.default(canvas);
    raytracer.setLookAt(0, 0, 10, 0, 0, 0);
    raytracer.lights.push(new Light_1.default({ pos: new Vector_1.default(5, 20, 20), color: new Vector_1.default(1, 1, 1), intensity: 20 }), new Light_1.default({ pos: new Vector_1.default(3, 22, 18), color: new Vector_1.default(1, 0.7, 0.5), intensity: 20 }));
    raytracer.spheres.push(new Sphere_1.default({ pos: new Vector_1.default(0.25, 0, 1), diffuse: new Vector_1.default(1, 0.7, 0.3), radius: 0.5, roughness: 250 }), new Sphere_1.default({ pos: new Vector_1.default(-0.5, -0.5, 0), diffuse: new Vector_1.default(1, 0.3, 0.3), radius: 0.5, roughness: 150 }));
    setTimeout(function () { raytracer.render(animate); }, 100);
}
function animate(raytracer) {
}
window.onload = function (event) { return main(); };
//# sourceMappingURL=main.js.map