"use strict";
var Scene = (function () {
    function Scene(canvas) {
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    return Scene;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Scene;
//# sourceMappingURL=Scene.js.map