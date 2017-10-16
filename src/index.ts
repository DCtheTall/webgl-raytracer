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
  canvas.height = sideLength;
  raytracer = new RayTracer(canvas);
  raytracer.spheres.push(
    new Sphere({
      radius: 0.5,
      diffuseColor: [0.2, 0.2, 1],
      position: new Vector(-1, 2, -2),
      phongExponent: 50,
      specularColor: [0.7, 0.8, 1],
    })
  );
  raytracer.lights.push(
    new Light({
      position: new Vector(5, 10, 3),
      color: [1, 1, 1],
    })
  );
  raytracer.render();
}

main();
