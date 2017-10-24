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
  canvas.width = sideLength;
  canvas.height = sideLength - 100;
  raytracer = new RayTracer(canvas);
  raytracer.cubes.push(
    new Cube({
      minExtent: new Vector(-0.3, -0.3, -0.3),
      maxExtent: new Vector(0.3, 0.3, 0.3),
      diffuseColor: [1, 0.2, 0.2],
      phongExponent: 50,
      specularColor: [1, 1, 1],
      position: new Vector(0.5, 0.6, 0),
    }),
    new Cube({
      minExtent: new Vector(-0.2, -0.2, -0.2),
      maxExtent: new Vector(0.2, 0.2, 0.2),
      diffuseColor: [1, 1, 0.2],
      phongExponent: 50,
      specularColor: [1, 1, 1],
      position: new Vector(-0.5, 0.5, 0),
    })
  );
  raytracer.cubes[0].rotateOnAxis(-(Math.PI / 4), new Vector(2, 1, 0));
  raytracer.cubes[1].rotateOnAxis(-(Math.PI / 3), new Vector(1, 0, 1));
  raytracer.spheres.push(
    new Sphere({
      radius: 0.2,
      diffuseColor: [1, 0.2, 0.2],
      position: new Vector(0, 1.3, 0.5),
      phongExponent: 30,
      specularColor: [1, 1, 1],
    })
  );
  raytracer.lights.push({
    position: new Vector(-2, 10, 5),
    color: [1, 1, 1],
  });
  raytracer.render();
}

main();
