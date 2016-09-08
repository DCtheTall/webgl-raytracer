/*

WebGL TypeScript Raytracer
--------------------------
Author: Dylan Cutler
--------------------

Main program

*/

import Scene from "./Scene";

function main(): void {
  let canvas: HTMLCanvasElement;
  let scene: Scene;
  canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  document.getElementById('container').appendChild(canvas);
  scene = new Scene(canvas);
  scene.render();
}
window.onload = (event: Event): void => main();
