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
import Sphere from "./Sphere";

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
    new Light({ pos: new Vector(5, 20, 20), color: new Vector(1, 1, 1), intensity: 20 }),
    new Light({ pos: new Vector(3, 22, 18), color: new Vector(1, 0.7, 0.5), intensity: 20 })
  );
  raytracer.spheres.push(
    new Sphere({ pos: new Vector(0.25, 0, 1), diffuse: new Vector(1, 0.7, 0.3), radius: 0.5, roughness: 250 }),
    new Sphere({ pos: new Vector(-0.5, -0.5, 0), diffuse: new Vector(1, 0.3, 0.3), radius: 0.5, roughness: 150 })
  );
  setTimeout(() => { raytracer.render(animate); }, 100);
}


function animate(raytracer: Raytracer): void {
}

window.onload = (event: Event): void => main();
