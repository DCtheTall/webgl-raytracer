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
  raytracer.camera = new Camera(new Vector(0, 5, 15), new Vector(0, 5, 0));
  raytracer.cubes.push(
    new Cube({
      minExtent: new Vector(-30, -30, -5),
      maxExtent: new Vector(30, 30, 5),
      diffuseColor: [0.72, 0.72, 0.7],
      phongExponent: 30,
      specularColor: [0.9, 0.9, 0.9],
      reflectivity: 0.07,
      position: new Vector(0, 30, -30),
      hoverable: false,
    }),
    new Cube({
      minExtent: new Vector(-30, -30, -5),
      maxExtent: new Vector(30, 30, 5),
      diffuseColor: [0.72, 0.72, 0.7],
      phongExponent: 30,
      specularColor: [0.9, 0.9, 0.9],
      reflectivity: 0.07,
      position: new Vector(0, 30, 30),
      hoverable: false,
    }),
    new Cube({
      minExtent: new Vector(-30, -30, -5),
      maxExtent: new Vector(30, 30, 5),
      diffuseColor: [0.72, 0.72, 0.7],
      phongExponent: 30,
      specularColor: [0.9, 0.9, 0.9],
      position: new Vector(-30, 30, 0),
      reflectivity: 0.07,
      hoverable: false,
    }).rotateOnAxis(Math.PI / 2, new Vector(0, 1, 0)),
    new Cube({
      minExtent: new Vector(-30, -30, -5),
      maxExtent: new Vector(30, 30, 5),
      diffuseColor: [0.72, 0.72, 0.7],
      phongExponent: 30,
      specularColor: [0.9, 0.9, 0.9],
      position: new Vector(30, 30, 0),
      reflectivity: 0.07,
      hoverable: false,
    }).rotateOnAxis(Math.PI / 2, new Vector(0, 1, 0)),
    new Cube({
      minExtent: new Vector(-30, -30, -5),
      maxExtent: new Vector(30, 30, 5),
      diffuseColor: [0.72, 0.72, 0.7],
      phongExponent: 30,
      specularColor: [0.9, 0.9, 0.9],
      position: new Vector(0, 60, 0),
      reflectivity: 0.07,
      hoverable: false,
    }).rotateOnAxis(Math.PI / 2, new Vector(1, 0, 0)),
    new Cube({
      minExtent: new Vector(-6, -2, -6),
      maxExtent: new Vector(6, 2, 6),
      diffuseColor: [134 / 255, 216 / 255, 193 / 255],
      phongExponent: 50,
      specularColor: [1, 1, 1],
      position: new Vector(0, 2.1, 0),
      reflectivity: 0.1,
    }),
    new Cube({
      minExtent: new Vector(-2, -2, -2),
      maxExtent: new Vector(2, 2, 2),
      diffuseColor: [0.6, 0.6, 0.7],
      phongExponent: 50,
      specularColor: [1, 1, 1],
      position: new Vector(10, 10, 3),
    }).rotateOnAxis(Math.PI / 6, new Vector(1, 1, 0)),
    new Cube({
      minExtent: new Vector(-2, -2, -2),
      maxExtent: new Vector(2, 2, 2),
      diffuseColor: [0.7, 0.7, 0.6],
      phongExponent: 50,
      specularColor: [1, 1, 1],
      position: new Vector(-10, 10, -3),
    }).rotateOnAxis(-Math.PI / 6, new Vector(1, 1, 0))
  );
  raytracer.spheres.push(
    new Sphere({
      radius: 4,
      position: new Vector(2, 8.1, -2),
      phongExponent: 20,
      useTexture: true,
      reflectivity: 0.1,
      angularVelocty: Math.PI / 5,
    }).setTextureImages(
      <HTMLImageElement>document.getElementById('earth-texture'),
      <HTMLImageElement>document.getElementById('earth-bump-map-texture')
    ),
    new Sphere({
      radius: 1.5,
      position: new Vector(-2, 5.6, 2),
      phongExponent: 300,
      reflectivity: 0.4,
      refractiveIndex: 1.2,
      opacity: 0.6,
      diffuseColor: [1, 1, 1],
      specularColor: [1, 1, 1],
    }),
    new Sphere({
      radius: 3,
      diffuseColor: [0.2, 0.2, 1],
      phongExponent: 50,
      specularColor: [1, 1, 1],
      refractiveIndex: 1.4,
      opacity: 0.7,
      position: new Vector(15, 3, 15),
    }),
    new Sphere({
      radius: 3,
      diffuseColor: [0.2, 1, 0.2],
      phongExponent: 50,
      specularColor: [1, 1, 1],
      refractiveIndex: 1.4,
      opacity: 0.7,
      position: new Vector(-15, 3, 15),
    }),
    new Sphere({
      radius: 3,
      diffuseColor: [1, 0.2, 0.2],
      phongExponent: 50,
      specularColor: [1, 1, 1],
      refractiveIndex: 1.4,
      opacity: 0.7,
      position: new Vector(-15, 3, -15),
    }),
    new Sphere({
      radius: 3,
      diffuseColor: [1, 1, 0.2],
      phongExponent: 50,
      specularColor: [1, 1, 1],
      refractiveIndex: 1.4,
      opacity: 0.7,
      position: new Vector(15, 3, -15),
    })
  );
  raytracer.lights.push(
    {
      position: new Vector(5, 40, 5),
      color: [1, 1, 0.8],
      intensity: 500,
    },
    {
      position: new Vector(8, 40, -2),
      color: [1, 1, 1],
      intensity: 300,
    }
  );

  controller = new Controller(raytracer);
  raytracer.render();
}

main();
