"use strict";
var Vector_1 = require("./Vector");
var Camera_1 = require("./Camera");
var Raytracer = (function () {
    function Raytracer(canvas) {
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clearColor(0, 0, 0, 1);
        this.camera = null;
    }
    Raytracer.prototype.setLookAt = function (eyeX, eyeY, eyeZ, atX, atY, atZ) {
        this.camera = new Camera_1.default(new Vector_1.default(eyeX, eyeY, eyeZ), new Vector_1.default(atX, atY, atZ));
    };
    Raytracer.prototype.render = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    };
    return Raytracer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Raytracer;
//# sourceMappingURL=Scene.js.map