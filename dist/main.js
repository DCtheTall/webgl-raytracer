"use strict";
var Raytracer_1 = require("./Raytracer");
var Vector_1 = require("./Vector");
var Light_1 = require("./Light");
var Sphere_1 = require("./Sphere");
function main() {
    var canvas;
    var raytracer;
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('container').appendChild(canvas);
    raytracer = new Raytracer_1.default(canvas);
    raytracer.setLookAt(-4, 2, 15, 0, 4, 0);
    raytracer.ANIMATE = true;
    raytracer.lights.push(new Light_1.default({ pos: new Vector_1.default(0, 8, 8), color: new Vector_1.default(0.3, 0.5, 0.3), intensity: 10 }), new Light_1.default({ pos: new Vector_1.default(6, 5, 10), color: new Vector_1.default(1, 0.7, 0.5), intensity: 10 }), new Light_1.default({ pos: new Vector_1.default(-5, 1, 2), color: new Vector_1.default(0.5, 0.5, 1), intensity: 8 }));
    raytracer.spheres.push(new Sphere_1.default({
        pos: new Vector_1.default(0, 0, 0),
        diffuse: new Vector_1.default(0.3, 0.5, 0.7),
        specular: new Vector_1.default(1, 1, 1),
        radius: 0.4,
        shininess: 500,
        refractiveIndex: 2.6,
        opacity: 0.5
    }), new Sphere_1.default({
        pos: new Vector_1.default(0, 0.6, 0),
        diffuse: new Vector_1.default(1, 0.4, 0.3),
        radius: 0.6,
        shininess: 50,
        refractiveIndex: 2,
        opacity: 0.8
    }));
    setTimeout(function () { raytracer.render(animate); }, 100);
}
function animate(raytracer) {
    raytracer.spheres[0].position.set(1.6 * Math.sin(new Date().getTime() / 1000), 0.6, 1.6 * Math.cos(new Date().getTime() / 1000));
}
window.onload = function (event) { return main(); };
//# sourceMappingURL=main.js.map