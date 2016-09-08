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
	var Scene_1 = __webpack_require__(1);
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	/*
	
	WebGL Raytracer
	---------------
	
	Scene object:
	- Initializes instance of WebGL
	- Calls functions for WebGL to render
	
	*/
	"use strict";
	var Scene = (function () {
	    function Scene(canvas) {
	        // Initialzing WebGL
	        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	        this.gl.viewport(0, 0, canvas.width, canvas.height);
	        this.gl.enable(this.gl.DEPTH_TEST);
	        this.gl.depthFunc(this.gl.LEQUAL);
	        this.gl.clearColor(0, 0, 0, 1);
	    }
	    Scene.prototype.render = function () {
	        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	    };
	    return Scene;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Scene;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map