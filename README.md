![alt tag](https://github.com/DCtheTall/WebGL_Raytracer/blob/master/demo.png)
# WebGL Raytracer
WebGL Raytracer written in TypeScript
and transpiled into ES5 with Webpack.

[Live demo](http://dylancutler.us/raytracer.html)

All of the TypeScript programs are located
in the ts/ directory. Output ES5 programs
are located in the dist/ directory.

The main program that runs in the browser
is index.html which uses a single `<script>`
tag whose source is the dist/bundle.js, the
output of the webpack build.

The ray tracing algorithm uses the following
rendering methods:
- Blinn-Phong global illumination model
- Pyramid tracing for shadows
- Finds reflectance of objects using the Fresnel equations
- Renders refracted light using matrix ray tracing
