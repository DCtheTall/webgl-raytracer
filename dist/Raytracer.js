"use strict";
var Vector_1 = require("./Vector");
var Camera_1 = require("./Camera");
var Shaders_1 = require("./Shaders");
var Raytracer = (function () {
    function Raytracer(canvas) {
        this.ASPECT_RATIO = canvas.width / canvas.height;
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clearDepth(1);
        this.shaderProgram = Shaders_1.default(this.gl);
        if (this.shaderProgram === null) {
            throw new Error("Could not compile shaders. See error message for details.");
        }
        this.initBuffers();
        this.camera = null;
        this.lights = [];
        this.spheres = [];
        this.ANIMATE = false;
    }
    Raytracer.prototype.initBuffers = function () {
        var aWindowPosition;
        var aPosition;
        var vertices;
        var windowBuffer;
        var positionBuffer;
        aWindowPosition = this.gl.getAttribLocation(this.shaderProgram, 'aWindowPosition');
        this.gl.enableVertexAttribArray(aWindowPosition);
        aPosition = this.gl.getAttribLocation(this.shaderProgram, 'aPosition');
        this.gl.enableVertexAttribArray(aPosition);
        vertices = [
            -1., 1.,
            -1., -1.,
            1., 1.,
            1., -1.
        ];
        windowBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, windowBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, windowBuffer);
        this.gl.vertexAttribPointer(aWindowPosition, 2, this.gl.FLOAT, false, 0, 0);
        positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.vertexAttribPointer(aPosition, 3, this.gl.FLOAT, false, 0, 0);
    };
    Raytracer.prototype.setLookAt = function (eyeX, eyeY, eyeZ, atX, atY, atZ) {
        this.camera = new Camera_1.default(new Vector_1.default(eyeX, eyeY, eyeZ), new Vector_1.default(atX, atY, atZ));
    };
    Raytracer.prototype.render = function (animate) {
        var _this = this;
        animate(this);
        var AspRat = this.ASPECT_RATIO;
        var cameraPosition;
        var lightUniform;
        var sphereUniform;
        var cameraTopLeft;
        var cameraBottomLeft;
        var cameraTopRight;
        var cameraBottomRight;
        var corners;
        var aPosition;
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        cameraPosition = this.gl.getUniformLocation(this.shaderProgram, 'cameraPos');
        this.gl.uniform3fv(cameraPosition, new Float32Array(Vector_1.default.push(this.camera.pos, [])));
        lightUniform = this.gl.getUniformLocation(this.shaderProgram, 'numLights');
        this.gl.uniform1i(lightUniform, this.lights.length);
        this.lights.map(function (currLight, index) {
            lightUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'lightPos[' + index + ']');
            _this.gl.uniform3fv(lightUniform, new Float32Array(Vector_1.default.push(currLight.position, [])));
            lightUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'lightCol[' + index + ']');
            _this.gl.uniform3fv(lightUniform, new Float32Array(Vector_1.default.push(currLight.color, [])));
            lightUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'intensities[' + index + ']');
            _this.gl.uniform1f(lightUniform, currLight.intensity);
        });
        sphereUniform = this.gl.getUniformLocation(this.shaderProgram, 'numSpheres');
        this.gl.uniform1i(sphereUniform, this.spheres.length);
        this.spheres.map(function (currSphere, index) {
            sphereUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'spherePos[' + index + ']');
            _this.gl.uniform3fv(sphereUniform, new Float32Array(Vector_1.default.push(currSphere.position, [])));
            sphereUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'sphereRadius[' + index + ']');
            _this.gl.uniform1f(sphereUniform, currSphere.radius);
            sphereUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'sphereDiff[' + index + ']');
            _this.gl.uniform3fv(sphereUniform, new Float32Array(Vector_1.default.push(currSphere.diffuse, [])));
            sphereUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'sphereSpec[' + index + ']');
            _this.gl.uniform3fv(sphereUniform, new Float32Array(Vector_1.default.push(currSphere.specular, [])));
            sphereUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'sphereRoughness[' + index + ']');
            _this.gl.uniform1f(sphereUniform, currSphere.roughness);
            sphereUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'sphereRefl[' + index + ']');
            _this.gl.uniform1f(sphereUniform, currSphere.reflectivity);
        });
        corners = [];
        cameraTopLeft = Vector_1.default.add(this.camera.forward, Vector_1.default.subtract(this.camera.up, Vector_1.default.scale(AspRat, this.camera.right)));
        cameraBottomLeft = Vector_1.default.subtract(this.camera.forward, Vector_1.default.add(this.camera.up, Vector_1.default.scale(AspRat, this.camera.right)));
        cameraTopRight = Vector_1.default.add(this.camera.forward, Vector_1.default.add(this.camera.up, Vector_1.default.scale(AspRat, this.camera.right)));
        cameraBottomRight = Vector_1.default.add(this.camera.forward, Vector_1.default.subtract(Vector_1.default.scale(AspRat, this.camera.right), this.camera.up));
        Vector_1.default.push(cameraTopLeft, corners);
        Vector_1.default.push(cameraBottomLeft, corners);
        Vector_1.default.push(cameraTopRight, corners);
        Vector_1.default.push(cameraBottomRight, corners);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(corners), this.gl.STATIC_DRAW);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        if (this.ANIMATE)
            window.requestAnimationFrame(function () { _this.render(animate); });
    };
    return Raytracer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Raytracer;
//# sourceMappingURL=Raytracer.js.map