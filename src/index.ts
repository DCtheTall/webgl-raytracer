import RayTracer from './Raytracer';
import Sphere from './Sphere';
import Vector from './Vector';
import Light from './Light';

function main(): void {
  let canvas: HTMLCanvasElement;
  let sideLength: number;
  let raytracer: RayTracer;

  canvas = <HTMLCanvasElement>document.getElementById('webgl-canvas');
  sideLength = window.innerWidth > 550 ? 500 : 300;
  canvas.width = sideLength;
  canvas.height = sideLength - 50;
  raytracer = new RayTracer(canvas);
  raytracer.spheres.push(
    new Sphere({
      radius: 0.5,
      diffuseColor: [0.2, 0.2, 1],
      position: new Vector(0, 0.5, -1.75),
      phongExponent: 50,
      specularColor: [0.7, 0.8, 1],
    }),
    new Sphere({
      radius: 0.2,
      diffuseColor: [1, 0.2, 0.2],
      position: new Vector(0.2, 1.2, -1.4),
      phongExponent: 30,
      specularColor: [1, 1, 1],
    })
  );
  raytracer.lights.push(
    new Light({
      position: new Vector(2, 10, 5),
      color: [1, 1, 1],
    })
  );
  raytracer.render();
}

main();
