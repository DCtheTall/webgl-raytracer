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
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed'
  canvas.style.left = '0px'; canvas.style.top = '0px';
  document.body.appendChild(canvas);

  raytracer = new Raytracer(canvas);
  raytracer.setLookAt(-1, 2, 15, 0, 5, 0);
  raytracer.ANIMATE = false;
  raytracer.lights.push(
    new Light({ pos: new Vector(0, 8, 8), color: new Vector(0.3, 0.5, 0.3), intensity: 10 }),
    new Light({ pos: new Vector(6, 5, 10), color: new Vector(1, 0.7, 0.5), intensity: 10 }),
    new Light({ pos: new Vector(-5, 1, 2), color: new Vector(0.5, 0.5, 1), intensity: 8 })
  );
  raytracer.spheres.push(
    new Sphere({
      pos: new Vector(0.5, 0.5, 1.5),
      diffuse: new Vector(0.3, 0.5, 0.7),
      specular: new Vector(1, 1, 1),
      radius: 0.3,
      shininess: 500,
      refractiveIndex: 2.6,
      opacity: 0.5
    }),
    new Sphere({
      pos: new Vector(-0.3, 0.5, -1),
      diffuse: new Vector(1, 0.5, 0.3),
      radius: 0.5,
      shininess: 50,
      refractiveIndex: 2.4,
      opacity: 0.8
    }),
    new Sphere({
      pos: new Vector(1.75, 0.8, -5),
      diffuse: new Vector(0.3, 0.7, 0.3),
      specular: new Vector(1, 1, 1),
      radius: 0.8,
      shininess: 500,
      refractiveIndex: 2,
      opacity: 0.4
    }),
    new Sphere({
      pos: new Vector(-0.8, 1, 4),
      diffuse: new Vector(1, 1, 1),
      radius: 0.2,
      shininess: 1000,
      refractiveIndex: 2.6,
      opacity: 0.3
    })
  );
  setTimeout(() => { raytracer.render(animate); }, 100);
}


function animate(raytracer: Raytracer): void {}
window.onload = (event: Event): void => main();
