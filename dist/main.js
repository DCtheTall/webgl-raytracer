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
    canvas.style.position = 'fixed';
    canvas.style.left = '0px';
    canvas.style.top = '0px';
    document.body.appendChild(canvas);
    raytracer = new Raytracer_1.default(canvas);
    initStaticScene(raytracer);
}
window.onload = function (event) { return main(); };
function initAnimatedScene(raytracer) {
    raytracer.setLookAt(-1, 2, 15, 0, 5, 0);
    raytracer.Animate = true;
    raytracer.lights.push(new Light_1.default({ pos: new Vector_1.default(0, 8, 8), color: new Vector_1.default(0.3, 0.5, 0.3), intensity: 10 }), new Light_1.default({ pos: new Vector_1.default(6, 5, 10), color: new Vector_1.default(1, 0.7, 0.5), intensity: 10 }), new Light_1.default({ pos: new Vector_1.default(-5, 1, 2), color: new Vector_1.default(0.5, 0.5, 1), intensity: 8 }));
    raytracer.spheres.push(new Sphere_1.default({
        pos: new Vector_1.default(0, 0.7, 0),
        diffuse: new Vector_1.default(0.9, 0.5, 0.3),
        specular: new Vector_1.default(1, 1, 1),
        radius: 0.5,
        shininess: 500,
        refractiveIndex: 2.6,
        opacity: 0.7
    }), new Sphere_1.default({
        pos: new Vector_1.default(0.6, 0.7, 0),
        diffuse: new Vector_1.default(0.7, 0.3, 0.3),
        specular: new Vector_1.default(1, 1, 1),
        radius: 0.07,
        shininess: 500,
        refractiveIndex: 2.4,
        opacity: 0.8
    }), new Sphere_1.default({
        pos: new Vector_1.default(1.3, 0.7, 0),
        diffuse: new Vector_1.default(0.3, 0.6, 0.8),
        specular: new Vector_1.default(1, 1, 1),
        radius: 0.15,
        shininess: 500,
        refractiveIndex: 2.5,
        opacity: 0.7
    }), new Sphere_1.default({
        pos: new Vector_1.default(1.32, 0.9, 0),
        diffuse: new Vector_1.default(1, 1, 1),
        specular: new Vector_1.default(1, 1, 1),
        radius: 0.04,
        shininess: 500,
        refractiveIndex: 2.5,
        opacity: 0.6
    }), new Sphere_1.default({
        pos: new Vector_1.default(1.75, 0, 0),
        diffuse: new Vector_1.default(0.3, 0.3, 1),
        specular: new Vector_1.default(1, 1, 1),
        radius: 0.3,
        refractiveIndex: 2.4,
        opacity: 0.4
    }));
    function animate(raytracer) {
        var time;
        var pos1;
        var pos2;
        var pos3;
        var pos4;
        time = new Date().getTime();
        pos1 = new Vector_1.default(0.7, 0.7, 0);
        pos1 = Vector_1.default.rotate(pos1, time / 723, new Vector_1.default(0, 1, 0));
        raytracer.spheres[1].position = pos1;
        pos2 = new Vector_1.default(1, 0.7, 0);
        pos2 = Vector_1.default.rotate(pos2, time / 1000, new Vector_1.default(0, 1, 0));
        raytracer.spheres[2].position = pos2;
        pos3 = new Vector_1.default(-0.3, 0.15, 0);
        pos3 = Vector_1.default.rotate(pos3, time / 600, new Vector_1.default(1, 2, 0));
        pos3 = Vector_1.default.add(pos2, pos3);
        raytracer.spheres[3].position = pos3;
        pos4 = new Vector_1.default(1.75, 0.7, 0);
        pos4 = Vector_1.default.rotate(pos4, time / 1870, new Vector_1.default(0, 1, 0));
        raytracer.spheres[4].position = pos4;
    }
    setTimeout(function () { raytracer.render(animate); }, 100);
}
function initStaticScene(raytracer) {
    raytracer.setLookAt(-1, 2, 15, 0, 5, 0);
    raytracer.Animate = false;
    raytracer.lights.push(new Light_1.default({ pos: new Vector_1.default(0, 8, 8), color: new Vector_1.default(0.3, 0.5, 0.3), intensity: 10 }), new Light_1.default({ pos: new Vector_1.default(6, 5, 10), color: new Vector_1.default(1, 0.7, 0.5), intensity: 10 }), new Light_1.default({ pos: new Vector_1.default(-5, 1, 2), color: new Vector_1.default(0.5, 0.5, 1), intensity: 8 }));
    raytracer.spheres.push(new Sphere_1.default({
        pos: new Vector_1.default(0.5, 0.5, 1.5),
        diffuse: new Vector_1.default(0.3, 0.5, 0.7),
        specular: new Vector_1.default(1, 1, 1),
        radius: 0.3,
        shininess: 500,
        refractiveIndex: 2.6,
        opacity: 0.5
    }), new Sphere_1.default({
        pos: new Vector_1.default(-0.3, 0.5, -1),
        diffuse: new Vector_1.default(1, 0.5, 0.3),
        radius: 0.5,
        shininess: 50,
        refractiveIndex: 2.4,
        opacity: 0.8
    }), new Sphere_1.default({
        pos: new Vector_1.default(1.75, 0.8, -5),
        diffuse: new Vector_1.default(0.3, 0.7, 0.3),
        specular: new Vector_1.default(1, 1, 1),
        radius: 0.8,
        shininess: 500,
        refractiveIndex: 2,
        opacity: 0.4
    }), new Sphere_1.default({
        pos: new Vector_1.default(-0.8, 1, 4),
        diffuse: new Vector_1.default(1, 1, 1),
        radius: 0.2,
        shininess: 1000,
        refractiveIndex: 2.6,
        opacity: 0.3
    }));
    setTimeout(function () { raytracer.render(); }, 100);
}
//# sourceMappingURL=main.js.map