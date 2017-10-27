import Raytracer from './Raytracer';
import Vector from './Vector';

export default class OrbitController {
  private raytracer: Raytracer;
  private isMouseDown: boolean;
  private polarAngle: number;
  private azimuthalAngle: number;
  private radius: number;
  private initialY: number;
  private lastRender: number;
  private rendering: Boolean;

  constructor(raytracer: Raytracer) {
    this.raytracer = raytracer;
    this.isMouseDown = false;
    this.azimuthalAngle = Math.PI / 2;
    this.radius = Vector.mag(new Vector(raytracer.camera.eye.x, 0, raytracer.camera.eye.z));
    this.polarAngle = Math.acos(raytracer.camera.eye.x / this.radius);
    this.initialY = raytracer.camera.eye.y;
    this.rendering = false;

    window.addEventListener('mousedown', () => this.isMouseDown = true);
    window.addEventListener('mouseup', () => this.isMouseDown = false);
    window.addEventListener('mousemove', this.moveCamera.bind(this));
  }

  private moveCamera(event: MouseEvent): void {
    if (!this.isMouseDown) return;

    let dx: number;
    let dy: number;

    dx = event.movementX;
    dy = event.movementY;

    this.polarAngle += dx / 100;
    this.azimuthalAngle += dy / 100;
    this.azimuthalAngle = Math.max(-Math.PI / 2, Math.min(this.azimuthalAngle, Math.PI / 2));

    this.raytracer.camera.eye = new Vector(
      this.radius * Math.cos(this.polarAngle) * Math.sin(this.azimuthalAngle),
      this.initialY + this.radius * Math.cos(this.azimuthalAngle),
      this.radius * Math.sin(this.polarAngle) * Math.sin(this.azimuthalAngle)
    );
    this.raytracer.camera.calculateViewDirection();

    this.raytracer.render();
  }
}
