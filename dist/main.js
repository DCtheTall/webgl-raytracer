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
    raytracer.setLookAt(0, 2, 10, 0, 2, 0);
    raytracer.ANIMATE = true;
    raytracer.lights.push(new Light_1.default({ pos: new Vector_1.default(5, 5, 10), color: new Vector_1.default(0.7, 0.7, 0.7), intensity: 15 }), new Light_1.default({ pos: new Vector_1.default(0, 8, 2), color: new Vector_1.default(1, 0.7, 0.5), intensity: 4 }), new Light_1.default({ pos: new Vector_1.default(-2, 4, -10), color: new Vector_1.default(0.5, 0.5, 1), intensity: 2 }));
    raytracer.spheres.push(new Sphere_1.default({ pos: new Vector_1.default(0.5, 0.6, 1), diffuse: new Vector_1.default(0.5, 0.5, 1), radius: 0.4, roughness: 250 }), new Sphere_1.default({ pos: new Vector_1.default(-0.5, 0.4, 0), diffuse: new Vector_1.default(1, 0.3, 0.3), radius: 0.4, roughness: 150 }));
    setTimeout(function () { raytracer.render(animate); }, 100);
}
function animate(raytracer) {
    raytracer.spheres[0].position.set(Math.sin(new Date().getTime() / 1000), 0.6, 1);
}
window.onload = function (event) { return main(); };
//# sourceMappingURL=main.js.map