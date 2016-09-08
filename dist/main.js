"use strict";
var Scene_1 = require("./Scene");
function main() {
    var canvas;
    var scene;
    canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    document.getElementById('container').appendChild(canvas);
    scene = new Scene_1.default(canvas);
    scene.render();
}
window.onload = function (event) { return main(); };
//# sourceMappingURL=main.js.map