import RayTracer from './Raytracer';
import Sphere from './Sphere';
import Vector from './Vector';
import Cube from './Cube';

function main(): void {
  let canvas: HTMLCanvasElement;
  let sideLength: number;
  let raytracer: RayTracer;

  canvas = <HTMLCanvasElement>document.getElementById('webgl-canvas');
  sideLength = window.innerWidth > 550 ? 500 : 300;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  raytracer = new RayTracer(canvas);
  raytracer.cubes.push(
    new Cube({
      minExtent: new Vector(-3, -3, -3),
      maxExtent: new Vector(3, 3, 3),
      diffuseColor: [1, 0.2, 0.2],
      phongExponent: 10,
      specularColor: [1, 1, 1],
      position: new Vector(5, 7, 0),
    }),
    new Cube({
      minExtent: new Vector(-2, -2, -2),
      maxExtent: new Vector(2, 2, 2),
      diffuseColor: [0.2, 1, 0.2],
      phongExponent: 10,
      specularColor: [1, 1, 1],
      position: new Vector(-5, 5, 0),
    })
  );
  raytracer.cubes[0].rotateOnAxis(-(Math.PI / 4), new Vector(2, 1, 0));
  raytracer.cubes[1].rotateOnAxis(-(Math.PI / 3), new Vector(1, 0, 1));
  raytracer.spheres.push(
    new Sphere({
      radius: 2,
      diffuseColor: [0.2, 0.2, 1],
      position: new Vector(0, 5, 5),
      phongExponent: 10,
      specularColor: [1, 1, 1],
      refractiveIndex: 1.3,
    })
  );
  raytracer.lights.push(
    {
      position: new Vector(-10, 40, 5),
      color: [1, 1, 1],
    },
    {
      position: new Vector(20, 40, 5),
      color: [1, 1, 1],
    }
  );
  raytracer.render();
}

main();
