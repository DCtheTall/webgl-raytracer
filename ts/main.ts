/*

WebGL TypeScript Raytracer
--------------------------
Author: Dylan Cutler
--------------------

Main program

*/

import Raytracer from "./Raytracer";
import Vector from "./Vector";
import Light from "./Light";

function main(): void {
  let canvas: HTMLCanvasElement;
  let raytracer: Raytracer;

  canvas = document.createElement("canvas");
  canvas.width = 700;
  canvas.height = 500;
  document.getElementById('container').appendChild(canvas);

  raytracer = new Raytracer(canvas);
  raytracer.setLookAt(0, 0, 10, 0, 0, 0);
  raytracer.lights.push(
    new Light({ pos: new Vector(-1, 2, 2), color: new Vector(1, 1, 1), intensity: 2 }),
    new Light({ pos: new Vector(8, 5, 2), color: new Vector(1., 0.5, 0), intensity: 10 })
  );
  setTimeout(() => { raytracer.render(); }, 100);
}
window.onload = (event: Event): void => main();
