import RayTracer from './Raytracer';
import Sphere from './Sphere';
import Vector from './Vector';
import Cube from './Cube';
import Camera from './Camera';
import Model from './Model';
import Controller from './Controller';

function main(): void {
  let canvas: HTMLCanvasElement;
  let raytracer: RayTracer;
  let controller: Controller;

  canvas = <HTMLCanvasElement>document.getElementById('webgl-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  raytracer = new RayTracer(canvas);
  raytracer.camera = new Camera(new Vector(0, 4, 14), new Vector(0, 4, 0));
  raytracer.cubes.push(
    new Cube({
      minExtent: new Vector(-3, -3, -3),
      maxExtent: new Vector(3, 3, 3),
      diffuseColor: [1, 0.2, 0.2],
      phongExponent: 10,
      specularColor: [1, 1, 1],
      position: new Vector(5, 3, 0),
    }).rotateOnAxis(-(Math.PI / 3), new Vector(0, 1, 0)),
    new Cube({
      minExtent: new Vector(-2, -2, -2),
      maxExtent: new Vector(2, 2, 2),
      diffuseColor: [0.2, 1, 0.2],
      phongExponent: 10,
      specularColor: [1, 1, 1],
      position: new Vector(-5, 5, 0),
    }).rotateOnAxis(-(Math.PI / 3), new Vector(1, 0, 1))
  );
  raytracer.spheres.push(
    new Sphere({
      radius: 3,
      diffuseColor: [0.2, 0.2, 1],
      position: new Vector(-1, 5, 5),
      phongExponent: 10,
      specularColor: [1, 1, 1],
      refractiveIndex: 1.3,
      useTexture: true,
      reflectivity: 0.1,
      angularVelocty: Math.PI / 5,
    }).setTextureImages(
      <HTMLImageElement>document.getElementById('earth-texture'),
      <HTMLImageElement>document.getElementById('earth-bump-map-texture')
    )
  );
  raytracer.lights.push(
    {
      position: new Vector(-10, 40, 15),
      color: [1, 1, 1],
      intensity: 700,
    },
    {
      position: new Vector(40, 10, 0),
      color: [1, 1, 1],
      intensity: 700,
    }
  );

  controller = new Controller(raytracer);
  raytracer.render();
}

main();
