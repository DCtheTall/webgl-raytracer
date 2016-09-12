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
  raytracer.setLookAt(0, 2, 10, 0, 2, 0);
  raytracer.ANIMATE = true;
  raytracer.lights.push(
    new Light({ pos: new Vector(5, 5, 10), color: new Vector(0.7, 0.7, 0.7), intensity: 15 }),
    new Light({ pos: new Vector(0, 8, 2), color: new Vector(1, 0.7, 0.5), intensity: 4 }),
    new Light({ pos: new Vector(-2, 4, -10), color: new Vector(0.5, 0.5, 1), intensity: 2 })
  );
  raytracer.spheres.push(
    new Sphere({ pos: new Vector(0.5, 0.6, 1), diffuse: new Vector(0.5, 0.5, 1), radius: 0.4, roughness: 250 }),
    new Sphere({ pos: new Vector(-0.5, 0.4, 0), diffuse: new Vector(1, 0.3, 0.3), radius: 0.4, roughness: 150 })
  );
  setTimeout(() => { raytracer.render(animate); }, 100);
}


function animate(raytracer: Raytracer): void {
  raytracer.spheres[0].position.set(Math.sin(new Date().getTime() / 1000), 0.6, 1);
}

window.onload = (event: Event): void => main();
