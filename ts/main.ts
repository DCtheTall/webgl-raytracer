/*

WebGL TypeScript Raytracer
--------------------------
Author: Dylan Cutler
--------------------

Main program

*/

import Raytracer from "./Raytracer";

function main(): void {
  let canvas: HTMLCanvasElement;
  let raytracer: Raytracer;
  canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  document.getElementById('container').appendChild(canvas);
  raytracer = new Raytracer(canvas);
  raytracer.render();
}
window.onload = (event: Event): void => main();
