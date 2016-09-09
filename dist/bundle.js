/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*
	
	WebGL TypeScript Raytracer
	--------------------------
	Author: Dylan Cutler
	--------------------
	
	Main program
	
	*/
	"use strict";
	var Raytracer_1 = __webpack_require__(1);
	function main() {
	    var canvas;
	    var raytracer;
	    canvas = document.createElement("canvas");
	    canvas.width = 500;
	    canvas.height = 500;
	    document.getElementById('container').appendChild(canvas);
	    raytracer = new Raytracer_1.default(canvas);
	    raytracer.render();
	}
	window.onload = function (event) { return main(); };


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
	
	WebGL Raytracer
	---------------
	
	Scene object:
	- Initializes instance of WebGL
	- Calls functions for WebGL to render
	
	*/
	"use strict";
	var Vector_1 = __webpack_require__(2);
	var Camera_1 = __webpack_require__(3);
	var Raytracer = (function () {
	    function Raytracer(canvas) {
	        // Initialzing WebGL
	        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	        this.gl.viewport(0, 0, canvas.width, canvas.height);
	        this.gl.enable(this.gl.DEPTH_TEST);
	        this.gl.depthFunc(this.gl.LEQUAL);
	        this.gl.clearColor(0, 0, 0, 1);
	        // Setting camera to null
	        this.camera = null;
	    }
	    // Set position and lookAt vector of camera
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	/*
	
	WebGL Raytracer
	---------------
	
	Vector object
	- vector operations
	- push components to an array
	
	*/
	"use strict";
	var Vector = (function () {
	    function Vector(x, y, z) {
	        this.x = x;
	        this.y = y;
	        this.z = z;
	    }
	    Vector.scale = function (k, v) {
	        return new Vector(k * v.x, k * v.y, k * v.z);
	    };
	    Vector.subtract = function (v1, v2) {
	        return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
	    };
	    Vector.mag = function (v) {
	        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
	    };
	    Vector.normalize = function (v) {
	        var mag;
	        var div;
	        mag = Vector.mag(v);
	        if (mag === 0) {
	            console.log('Cannot normalize zero vector');
	            return null;
	        }
	        div = 1 / mag;
	        return Vector.scale(div, v);
	    };
	    Vector.cross = function (v1, v2) {
	        return new Vector(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
	    };
	    Vector.push = function (v, array) {
	        array.push(v.x, v.y, v.z);
	    };
	    return Vector;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Vector;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*
	
	WebGL Raytracer
	---------------
	
	Camera object:
	- has public vector classes for raytracer
	
	*/
	"use strict";
	var Vector_1 = __webpack_require__(2);
	var Camera = (function () {
	    function Camera(pos, lookAt) {
	        this.pos = pos;
	        var down;
	        down = new Vector_1.default(0, -1, 0);
	        this.forward = Vector_1.default.normalize(Vector_1.default.subtract(lookAt, this.pos));
	        this.right = Vector_1.default.normalize(Vector_1.default.cross(down, this.forward));
	        this.up = Vector_1.default.normalize(Vector_1.default.cross(this.right, this.forward));
	    }
	    // Zoom camera in or out
	    // a number >1 zooms the camera out k times
	    // a number <1 zooms the camera in 1/k times
	    Camera.prototype.zoom = function (k) {
	        this.right = Vector_1.default.scale(k, this.right);
	        this.up = Vector_1.default.scale(k, this.right);
	    };
	    return Camera;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Camera;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map