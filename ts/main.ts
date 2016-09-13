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
  document.getElementById('container').appendChild(canvas);

  raytracer = new Raytracer(canvas);
  raytracer.setLookAt(-4, 2, 15, 0, 4, 0);
  raytracer.ANIMATE = true;
  raytracer.lights.push(
    new Light({ pos: new Vector(0, 8, 8), color: new Vector(0.3, 0.5, 0.3), intensity: 10 }),
    new Light({ pos: new Vector(6, 5, 10), color: new Vector(1, 0.7, 0.5), intensity: 10 }),
    new Light({ pos: new Vector(-5, 1, 2), color: new Vector(0.5, 0.5, 1), intensity: 8 })
  );
  raytracer.spheres.push(
    new Sphere({
      pos: new Vector(0, 0, 0),
      diffuse: new Vector(0.3, 0.5, 0.7),
      specular: new Vector(1, 1, 1),
      radius: 0.4,
      shininess: 500,
      refractiveIndex: 2.6,
      opacity: 0.5
    }),
    new Sphere({
      pos: new Vector(0, 0.6, 0),
      diffuse: new Vector(1, 0.4, 0.3),
      radius: 0.6,
      shininess: 50,
      refractiveIndex: 2,
      opacity: 0.8
    })
  );
  setTimeout(() => { raytracer.render(animate); }, 100);
}


function animate(raytracer: Raytracer): void {
  raytracer.spheres[0].position.set(1.6 * Math.sin(new Date().getTime() / 1000), 0.6, 1.6 * Math.cos(new Date().getTime() / 1000));
}

window.onload = (event: Event): void => main();
