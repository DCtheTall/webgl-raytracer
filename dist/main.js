"use strict";
var Raytracer_1 = require("./Raytracer");
var Vector_1 = require("./Vector");
var Light_1 = require("./Light");
function main() {
    var canvas;
    var raytracer;
    canvas = document.createElement("canvas");
    canvas.width = 700;
    canvas.height = 500;
    document.getElementById('container').appendChild(canvas);
    raytracer = new Raytracer_1.default(canvas);
    raytracer.setLookAt(0, 0, 10, 0, 0, 0);
    raytracer.lights.push(new Light_1.default({ pos: new Vector_1.default(-1, 2, 2), color: new Vector_1.default(1, 1, 1), intensity: 2 }), new Light_1.default({ pos: new Vector_1.default(8, 5, 2), color: new Vector_1.default(1., 0.5, 0), intensity: 10 }));
    setTimeout(function () { raytracer.render(); }, 100);
}
window.onload = function (event) { return main(); };
//# sourceMappingURL=main.js.map