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
  initStaticScene(raytracer);
}

window.onload = (event: Event): void => main();

/***** Create animated scene *****/

function initAnimatedScene(raytracer: Raytracer) {
  raytracer.setLookAt(-1, 2, 15, 0, 5, 0);
  raytracer.Animate = true;
  raytracer.lights.push(
    new Light({ pos: new Vector(0, 8, 8), color: new Vector(0.3, 0.5, 0.3), intensity: 10 }),
    new Light({ pos: new Vector(6, 5, 10), color: new Vector(1, 0.7, 0.5), intensity: 10 }),
    new Light({ pos: new Vector(-5, 1, 2), color: new Vector(0.5, 0.5, 1), intensity: 8 })
  );
  raytracer.spheres.push(
    new Sphere({
      pos: new Vector(0, 0.7, 0),
      diffuse: new Vector(0.9, 0.5, 0.3),
      specular: new Vector(1, 1, 1),
      radius: 0.5,
      shininess: 500,
      refractiveIndex: 2.6,
      opacity: 0.7
    }),
    new Sphere({
      pos: new Vector(0.6, 0.7, 0),
      diffuse: new Vector(0.7, 0.3, 0.3),
      specular: new Vector(1, 1, 1),
      radius: 0.07,
      shininess: 500,
      refractiveIndex: 2.4,
      opacity: 0.8
    }),
    new Sphere({
      pos: new Vector(1.3, 0.7, 0),
      diffuse: new Vector(0.3, 0.6, 0.8),
      specular: new Vector(1, 1, 1),
      radius: 0.15,
      shininess: 500,
      refractiveIndex: 2.5,
      opacity: 0.7
    }),
    new Sphere({
      pos: new Vector(1.32, 0.9, 0),
      diffuse: new Vector(1, 1, 1),
      specular: new Vector(1, 1, 1),
      radius: 0.04,
      shininess: 500,
      refractiveIndex: 2.5,
      opacity: 0.6
    }),
    new Sphere({
      pos: new Vector(1.75, 0, 0),
      diffuse: new Vector(0.3, 0.3, 1),
      specular: new Vector(1, 1, 1),
      radius: 0.3,
      refractiveIndex: 2.4,
      opacity: 0.4
    })
  )

  function animate(raytracer: Raytracer): void {
    let time: number;
    let pos1: Vector;
    let pos2: Vector;
    let pos3: Vector;
    let pos4: Vector;
    time = new Date().getTime();
    pos1 = new Vector(0.7, 0.7, 0);
    pos1 = Vector.rotate(pos1, time/723, new Vector(0, 1, 0));
    raytracer.spheres[1].position = pos1;
    pos2 = new Vector(1, 0.7, 0);
    pos2 = Vector.rotate(pos2, time/1000, new Vector(0, 1, 0));
    raytracer.spheres[2].position = pos2;
    pos3 = new Vector(-0.3, 0.15, 0);
    pos3 = Vector.rotate(pos3, time/600, new Vector(1, 2, 0));
    pos3 = Vector.add(pos2, pos3);
    raytracer.spheres[3].position = pos3;
    pos4 = new Vector(1.75, 0.7, 0);
    pos4 = Vector.rotate(pos4, time/1870, new Vector(0, 1, 0));
    raytracer.spheres[4].position = pos4;
  }
  setTimeout(() => { raytracer.render(animate) }, 100);
}


/***** Create static scene *****/

function initStaticScene(raytracer: Raytracer) {
  raytracer.setLookAt(-1, 2, 15, 0, 5, 0);
  raytracer.Animate = false;
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

  setTimeout(() => { raytracer.render(); }, 100);
}
