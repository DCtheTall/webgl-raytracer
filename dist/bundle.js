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
	var Vector_1 = __webpack_require__(2);
	var Light_1 = __webpack_require__(5);
	var Sphere_1 = __webpack_require__(6);
	function main() {
	    var canvas;
	    var raytracer;
	    canvas = document.createElement("canvas");
	    canvas.width = 700;
	    canvas.height = 500;
	    document.getElementById('container').appendChild(canvas);
	    raytracer = new Raytracer_1.default(canvas);
	    raytracer.setLookAt(0, 0, 10, 0, 0, 0);
	    raytracer.lights.push(new Light_1.default({ pos: new Vector_1.default(5, 20, 20), color: new Vector_1.default(1, 1, 1), intensity: 20 }), new Light_1.default({ pos: new Vector_1.default(3, 22, 18), color: new Vector_1.default(1, 0.7, 0.5), intensity: 20 }));
	    raytracer.spheres.push(new Sphere_1.default({ pos: new Vector_1.default(0.25, 0, 1), diffuse: new Vector_1.default(1, 0.7, 0.3), radius: 0.5, roughness: 250 }), new Sphere_1.default({ pos: new Vector_1.default(-0.5, -0.5, 0), diffuse: new Vector_1.default(1, 0.3, 0.3), radius: 0.5, roughness: 150 }));
	    setTimeout(function () { raytracer.render(animate); }, 100);
	}
	function animate(raytracer) {
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
	- Initializes the shaders using initShaders()
	- Sends information about the camera to the GPU
	- Renders the scene
	
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
	        this.ASPECT_RATIO = canvas.width / canvas.height;
	        // Initialzing WebGL
	        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	        this.gl.viewport(0, 0, canvas.width, canvas.height);
	        this.gl.clearColor(0, 0, 0, 1);
	        this.gl.clearDepth(1);
	        // Initializing shaders
	        this.shaderProgram = Shaders_1.default(this.gl);
	        if (this.shaderProgram === null) {
	            throw new Error("Could not compile shaders. See error message for details.");
	        }
	        // Initializing buffers
	        this.initBuffers();
	        // Setting camera to null
	        this.camera = null;
	        // Initializing lights array
	        this.lights = [];
	        // Initializing spheres array
	        this.spheres = [];
	    }
	    /*
	    * This method initializes the vertex buffers, input is aspect ratio
	    *
	    * @class Raytracer
	    * @method initBuffers
	    */
	    Raytracer.prototype.initBuffers = function () {
	        var aWindowPosition;
	        var aPosition;
	        var vertices;
	        var windowBuffer;
	        var positionBuffer;
	        // Buffer for the vertices of the window
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
	    Raytracer.prototype.render = function (animate) {
	        var _this = this;
	        // Executes callback for each draw
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
	        // Clear last rendered frame
	        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	        // Passing camera position to the shader
	        cameraPosition = this.gl.getUniformLocation(this.shaderProgram, 'cameraPos');
	        this.gl.uniform3fv(cameraPosition, new Float32Array(Vector_1.default.push(this.camera.pos, [])));
	        // Passing lights to the shader
	        lightUniform = this.gl.getUniformLocation(this.shaderProgram, 'numLights');
	        this.gl.uniform1i(lightUniform, this.lights.length);
	        this.lights.map(function (currLight, index) {
	            // Sending positions
	            lightUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'lightPos[' + index + ']');
	            _this.gl.uniform3fv(lightUniform, new Float32Array(Vector_1.default.push(currLight.position, [])));
	            // Sending colors
	            lightUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'lightCol[' + index + ']');
	            _this.gl.uniform3fv(lightUniform, new Float32Array(Vector_1.default.push(currLight.color, [])));
	            // Sending intensities
	            lightUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'intensities[' + index + ']');
	            _this.gl.uniform1f(lightUniform, currLight.intensity);
	        });
	        // Passing spheres to the shader
	        sphereUniform = this.gl.getUniformLocation(this.shaderProgram, 'numSpheres');
	        this.gl.uniform1i(sphereUniform, this.spheres.length);
	        this.spheres.map(function (currSphere, index) {
	            // Sending positions
	            sphereUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'spherePos[' + index + ']');
	            _this.gl.uniform3fv(sphereUniform, new Float32Array(Vector_1.default.push(currSphere.position, [])));
	            // Sending radius of sphere
	            sphereUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'sphereRadius[' + index + ']');
	            _this.gl.uniform1f(sphereUniform, currSphere.radius);
	            // Sending diffuse colors
	            sphereUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'sphereDiff[' + index + ']');
	            _this.gl.uniform3fv(sphereUniform, new Float32Array(Vector_1.default.push(currSphere.diffuse, [])));
	            // Sending specular colors
	            sphereUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'sphereSpec[' + index + ']');
	            _this.gl.uniform3fv(sphereUniform, new Float32Array(Vector_1.default.push(currSphere.specular, [])));
	            // Sending Phong exponent to the shader
	            sphereUniform = _this.gl.getUniformLocation(_this.shaderProgram, 'sphereRoughness[' + index + ']');
	            _this.gl.uniform1f(sphereUniform, currSphere.roughness);
	        });
	        // Get camera corners
	        corners = [];
	        cameraTopLeft = Vector_1.default.add(this.camera.forward, Vector_1.default.subtract(this.camera.up, Vector_1.default.scale(AspRat, this.camera.right)));
	        cameraBottomLeft = Vector_1.default.subtract(this.camera.forward, Vector_1.default.add(this.camera.up, Vector_1.default.scale(AspRat, this.camera.right)));
	        cameraTopRight = Vector_1.default.add(this.camera.forward, Vector_1.default.add(this.camera.up, Vector_1.default.scale(AspRat, this.camera.right)));
	        cameraBottomRight = Vector_1.default.add(this.camera.forward, Vector_1.default.subtract(Vector_1.default.scale(AspRat, this.camera.right), this.camera.up));
	        Vector_1.default.push(cameraTopLeft, corners);
	        Vector_1.default.push(cameraBottomLeft, corners);
	        Vector_1.default.push(cameraTopRight, corners);
	        Vector_1.default.push(cameraBottomRight, corners);
	        // Passing corners to the shader via the array buffer
	        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(corners), this.gl.STATIC_DRAW);
	        // Draw new frame
	        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
	        // Render loop
	        window.requestAnimationFrame(function () { _this.render(animate); });
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
	    Vector.prototype.set = function (x, y, z) {
	        this.x = x;
	        this.y = y;
	        this.z = z;
	    };
	    Vector.scale = function (k, v) {
	        return new Vector(k * v.x, k * v.y, k * v.z);
	    };
	    Vector.add = function (v1, v2) {
	        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
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
	        return array;
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
	- contains function to get shader program from source and compiles them
	- exports a function which initializes the shaders and returns the shader
	  program
	
	*/
	"use strict";
	/****************************************************/
	/*
	* SHADER SOURCE CODE
	*/
	var VERTEX_SHADER;
	var FRAGMENT_SHADER;
	/* VERTEX SHADER */
	VERTEX_SHADER = "\n  precision mediump float;\n\n  attribute vec2 aWindowPosition;\n  attribute vec3 aPosition;\n\n  varying vec3 vPosition;\n\n  void main() {\n    gl_Position = vec4(aWindowPosition, 1., 1.);\n    vPosition = aPosition;\n  }\n";
	/* FRAGMENT SHADER */
	FRAGMENT_SHADER = "\n  precision mediump float;\n\n  varying vec3 vPosition;\n\n  uniform vec3 cameraPos;\n  uniform int numLights;\n  uniform vec3 lightPos[32];\n  uniform vec3 lightCol[32];\n  uniform float intensities[32];\n  uniform int numSpheres;\n  uniform vec3 spherePos[32];\n  uniform float sphereRadius[32];\n  uniform vec3 sphereDiff[32];\n  uniform vec3 sphereSpec[32];\n  uniform float sphereRoughness[32];\n\n  /**\n  * Intersection test for spheres\n  */\n  float intersectSphere(vec3 rayStart, vec3 rayDir, vec3 center, float r) {\n    vec3 at;\n    float v;\n    float dist;\n    float disc;\n\n    at = center - rayStart;\n    v = dot(at, rayDir);\n    dist = -1.;\n    if( v >= 0. ) {\n      disc = r * r - ( dot(at, at) - v * v );\n      if( disc > 0. ) dist = v - sqrt(disc);\n    }\n    return dist;\n  }\n\n  /**\n  * Color fragment using Blinn-Phong global illumination model\n  */\n  vec3 getNaturalColor( vec3 pos,\n                        vec3 normal,\n                        vec3 viewDir,\n                        vec3 diffColor,\n                        vec3 specColor,\n                        float roughness )\n  {\n    vec3 color = vec3(0.);\n    for ( int i = 0; i < 32; i++ ) {\n      if( i > numLights ) continue;\n\n      vec3 currPos;\n      vec3 currColor;\n      float intensity;\n      vec3 lightDir;\n      float distance;\n      float lambertian;\n      vec3 H;\n      float specular;\n\n      lightDir = normalize(lightPos[i] - pos);\n      distance = length(lightPos[i] - pos);\n\n      lambertian = intensities[i] * clamp( dot(normal, lightDir), 0.2, 1. ) / distance;\n\n      H = normalize(reflect(lightDir, pos) + viewDir);\n      specular = intensities[i] * clamp( pow(dot(normal, H), 50.), 0.01, 1.) / distance / distance;\n\n      color += (lambertian * diffColor + specular * specColor) * lightCol[i];\n    }\n    return color;\n  }\n\n  /**\n  * Intersection test for the world\n  * returns a color vector\n  */\n  vec3 intersectWorld(vec3 rayStart, vec3 rayDir) {\n    vec3 color;\n    float closestDist;\n\n    color = vec3(0.);\n    closestDist = 100000.;\n\n    for( int i = 0; i < 32; i++ ) {\n      if( i > numSpheres ) continue;\n\n      float dist;\n      dist = intersectSphere(rayStart, rayDir, spherePos[i], sphereRadius[i]);\n\n      if( dist > 0. && dist < closestDist ) {\n        vec3 pos;\n        vec3 normal;\n        pos = dist * rayDir + rayStart;\n        normal = normalize(pos - spherePos[i]);\n        color = getNaturalColor(pos, normal, -rayDir, sphereDiff[i], sphereSpec[i], sphereRoughness[i]);\n        closestDist = dist;\n      }\n    }\n\n    return color;\n  }\n\n  /**\n  * main function\n  */\n  void main() {\n    vec3 cameraDir;\n    vec3 color;\n\n    cameraDir = normalize(vPosition - cameraPos);\n    color = intersectWorld(cameraPos, cameraDir);\n\n    gl_FragColor = vec4(color, 1.);\n  }\n";
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


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
	
	WebGL Raytracer
	---------------
	
	Light object:
	- contains information that will be passed to the GPU for each light source
	
	*/
	"use strict";
	/*
	* This class will send info about a light source to the GPU
	*
	* @class Light
	*/
	var Light = (function () {
	    function Light(params) {
	        this.position = params.pos;
	        this.color = params.color;
	        this.intensity = params.intensity;
	    }
	    return Light;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Light;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
	
	WebGL Raytracer
	---------------
	
	Sphere object:
	- contains information that will be passed to the GPU for each sphere object
	
	*/
	"use strict";
	var Vector_1 = __webpack_require__(2);
	/*
	* Sphere object
	*
	* @class Sphere
	*/
	var Sphere = (function () {
	    function Sphere(params) {
	        this.position = params.pos;
	        this.radius = params.radius;
	        this.diffuse = params.diffuse;
	        this.specular = params.specular === undefined ?
	            new Vector_1.default(0.9, 0.9, 0.9) : params.specular;
	        this.roughness = params.roughness;
	    }
	    return Sphere;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Sphere;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map