import Raytracer from './Raytracer';
import Vector from './Vector';
import Quaternion from './Quaternion';
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
  private mouseMoveCallback: (event?: MouseEvent) => void;

  public enabled: boolean;

  constructor(raytracer: Raytracer) {
    this.raytracer = raytracer;
    this.mouseMoveCallback = () => {};
    this.enabled = false;
    this.castRayIntoScene = this.castRayIntoScene.bind(this);
    window.addEventListener('mousemove', event => this.mouseMoveCallback(event));
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
      sphere.isHovering = false;
      distance = intersectSphere(rayStart, rayDirection, sphere.position, sphere.radius);
      if ((!closestModel && distance > 0)
          || (distance > 0 && distance < closestDistance)) {
        closestDistance = distance;
        closestModel = sphere;
      }
    });

    this.raytracer.cubes.forEach((cube: Cube) => {
      let distance: number;
      cube.isHovering = false;
      distance = intersectCube(
        rayStart,
        rayDirection,
        cube.minExtent,
        cube.maxExtent,
        cube.rotation || new Quaternion(1, 0, 0, 0),
        cube.position
      );
      if ((!closestModel && distance > 0)
          || (distance > 0 && distance < closestDistance)) {
        closestDistance = distance;
        closestModel = cube;
      }
    });

    if (closestModel === this.closestModel) return;

    if (this.closestModel) this.closestModel.isHovering = false;
    if (closestModel) closestModel.isHovering = true;
    this.closestModel = closestModel;
    this.mouseMoveCallback = () => {};
    this.raytracer.render();
    this.mouseMoveCallback = this.castRayIntoScene;
  }

  public enable(): void {
    this.mouseMoveCallback = this.castRayIntoScene;
    this.enabled = true;
  }

  public disable(): void {
    this.mouseMoveCallback = () => {};
    this.enabled = false;
  }
}
