"use strict";
var Vector_1 = require("./Vector");
var Camera_1 = require("./Camera");
var Shaders_1 = require("./Shaders");
var Raytracer = (function () {
    function Raytracer(canvas) {
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clearColor(0, 0, 0, 1);
        this.shaderProgram = Shaders_1.default(this.gl);
        if (this.shaderProgram === null) {
            throw new Error("Could not compile shaders. See error message for details.");
        }
        this.initBuffers();
        this.camera = null;
    }
    Raytracer.prototype.initBuffers = function () {
        var aWindowPosition;
        var vertices;
        var windowBuffer;
        aWindowPosition = this.gl.getAttribLocation(this.shaderProgram, 'aWindowPosition');
        this.gl.enableVertexAttribArray(aWindowPosition);
        vertices = [
            1., 1.,
            -1., 1.,
            1., -1.,
            -1., -1.
        ];
        windowBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, windowBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(aWindowPosition, 2, this.gl.FLOAT, false, 0, 0);
    };
    Raytracer.prototype.setLookAt = function (eyeX, eyeY, eyeZ, atX, atY, atZ) {
        this.camera = new Camera_1.default(new Vector_1.default(eyeX, eyeY, eyeZ), new Vector_1.default(atX, atY, atZ));
    };
    Raytracer.prototype.render = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    };
    return Raytracer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Raytracer;
//# sourceMappingURL=Raytracer.js.map