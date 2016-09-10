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
	var Shaders_1 = __webpack_require__(4);
	var Raytracer = (function () {
	    /*
	    * @class Raytracer
	    * @constructor
	    */
	    function Raytracer(canvas) {
	        // Initialzing WebGL
	        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	        this.gl.viewport(0, 0, canvas.width, canvas.height);
	        this.gl.enable(this.gl.DEPTH_TEST);
	        this.gl.depthFunc(this.gl.LEQUAL);
	        this.gl.clearColor(0, 0, 0, 1);
	        // Initializing shaders
	        this.shaderProgram = Shaders_1.default(this.gl);
	        if (this.shaderProgram === null) {
	            throw new Error("Could not compile shaders. See error message for details.");
	        }
	        // Initializing buffers
	        this.initBuffers();
	        // Setting camera to null
	        this.camera = null;
	    }
	    /*
	    * This method initializes the vertex buffers
	    *
	    * @class Raytracer
	    * @method initBuffers
	    */
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
	    /*
	    * This method sets position and lookAt vectors of the camera
	    *
	    * @class Raycaster
	    * @method setLookAt
	    */
	    Raytracer.prototype.setLookAt = function (eyeX, eyeY, eyeZ, atX, atY, atZ) {
	        this.camera = new Camera_1.default(new Vector_1.default(eyeX, eyeY, eyeZ), new Vector_1.default(atX, atY, atZ));
	    };
	    /*
	    * This method renders the scene in WebGL
	    *
	    * @class Raycaster
	    * @method render
	    */
	    Raytracer.prototype.render = function () {
	        // Clear last rendered frame
	        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	        // Draw new frame
	        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
	
	WebGL Raytracer
	---------------
	
	Shaders module:
	- contains source for vertex and fragment shaders
	- contains function to get shader program from source
	
	*/
	"use strict";
	/****************************************************/
	/*
	* SHADER SOURCE CODE
	*/
	var VERTEX_SHADER;
	var FRAGMENT_SHADER;
	/* VERTEX SHADER */
	VERTEX_SHADER = "\n  attribute vec2 aWindowPosition;\n\n  void main() {\n    gl_Position = vec4(aWindowPosition, 1., 1.);\n  }\n";
	/* FRAGMENT SHADER */
	FRAGMENT_SHADER = "\n  void main() {\n    gl_FragColor = vec4(1., 0., 0., 1.);\n  }\n";
	/****************************************************/
	/*
	* This function loads the shader from the source code
	*/
	function getShader(gl, source, vertexOrFragment) {
	    var shader;
	    shader = vertexOrFragment ?
	        gl.createShader(gl.VERTEX_SHADER) : gl.createShader(gl.FRAGMENT_SHADER);
	    gl.shaderSource(shader, source);
	    gl.compileShader(shader);
	    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	        console.error('Shader failed to compile: ' + gl.getShaderInfoLog(shader));
	        return null;
	    }
	    return shader;
	}
	/****************************************************/
	/*
	* Shader module contains shader source and methods to compile/attach shaders
	*
	* @function initShaders
	*/
	function initShaders(gl) {
	    var vertexShader;
	    var fragmentShader;
	    var shaderProgram;
	    vertexShader = getShader(gl, VERTEX_SHADER, true);
	    fragmentShader = getShader(gl, FRAGMENT_SHADER, false);
	    if (vertexShader === null || fragmentShader === null) {
	        console.log("Shader failed to compile. See error message for details.");
	        return null;
	    }
	    shaderProgram = gl.createProgram();
	    gl.attachShader(shaderProgram, vertexShader);
	    gl.attachShader(shaderProgram, fragmentShader);
	    gl.linkProgram(shaderProgram);
	    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	        console.error("Could not initialize shader program.");
	        return null;
	    }
	    gl.useProgram(shaderProgram);
	    return shaderProgram;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = initShaders;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map