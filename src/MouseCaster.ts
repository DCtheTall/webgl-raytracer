import Raytracer from './Raytracer';
import Vector from './Vector';
import Model from './Model';
import Cube from './Cube';
import Sphere from './Sphere';
import {
  intersectSphere,
  intersectCube,
} from './lib/geometry';

export default class MouseCaster {
  private raytracer: Raytracer;
  private closestModel: Model;

  constructor(raytracer: Raytracer) {
    this.raytracer = raytracer;
    window.addEventListener('mousemove', this.castRayIntoScene.bind(this));
  }

  private castRayIntoScene(event: MouseEvent): void {
    let rayStart: Vector;
    let aspectRatio: number;
    let clientX: number;
    let clientY: number;
    let down: Vector;
    let right: Vector;
    let up: Vector;
    let rayDirection: Vector;
    let closestDistance: number;
    let closestModel: Model;

    rayStart = this.raytracer.camera.eye;
    aspectRatio = this.raytracer.canvas.width / this.raytracer.canvas.height;
    clientX = ((event.clientX / this.raytracer.canvas.width) * 2) - 1;
    clientY = -((event.clientY / this.raytracer.canvas.height) * 2) + 1;
    down = new Vector(0, -1, 0);
    right = Vector.normalize(Vector.cross(down, this.raytracer.camera.viewDirection));
    up = Vector.normalize(Vector.cross(right, this.raytracer.camera.viewDirection));
    rayDirection = Vector.normalize(Vector.add(
      Vector.scale(aspectRatio * clientX, right),
      Vector.add(Vector.scale(clientY, up), this.raytracer.camera.viewDirection)
    ));

    closestDistance = -1;

    this.raytracer.spheres.forEach((sphere: Sphere) => {
      let distance: number;
      sphere.glowOff();
      distance = intersectSphere(rayStart, rayDirection, sphere.position, sphere.radius);
      if ((!closestModel && distance > 0)
          || (distance > 0 && distance < closestDistance)) {
        closestDistance = distance;
        closestModel = sphere;
      }
    });

    this.raytracer.cubes.forEach((cube: Cube) => {
      let distance: number;
      cube.glowOff();
      distance = intersectCube(
        rayStart,
        rayDirection,
        cube.minExtent,
        cube.maxExtent,
        cube.rotation,
        cube.position
      );
      if ((!closestModel && distance > 0)
          || (distance > 0 && distance < closestDistance)) {
        closestDistance = distance;
        closestModel = cube;
      }
    });

    if (closestModel) {
      this.closestModel = closestModel;
      closestModel.glowOn();
      this.raytracer.render();
    }
    this.raytracer.render();
  }
}
