import RayTracer from './Raytracer';
import Sphere from './Sphere';
import Vector from './Vector';

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
      radius: 0.2,
      diffuseColor: [0, 0, 1],
      position: new Vector(0, 0, -2),
    })
  );
  raytracer.render();
}

main();
