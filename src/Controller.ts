import Raytracer from './Raytracer';
import OrbitController from './OrbitController';
import MouseCaster from './MouseCaster';

export default class Controller {
  private raytracer: Raytracer;
  private orbitController: OrbitController;
  private mouseCaster: MouseCaster;
  private orbitControllerToggle: HTMLButtonElement;
  private mouseCasterToggle: HTMLButtonElement;

  constructor(raytracer: Raytracer) {
    this.raytracer = raytracer;
    this.orbitController = new OrbitController(raytracer);
    this.mouseCaster = new MouseCaster(raytracer);
    this.orbitControllerToggle = <HTMLButtonElement>document.getElementById('orbit-control-toggle');
    this.orbitControllerToggle.innerHTML = 'Enable Orbit Controller';
    this.orbitControllerToggle.addEventListener('click', this.toggleOrbitControls.bind(this));
    this.mouseCasterToggle = <HTMLButtonElement>document.getElementById('mouse-caster-toggle');
    this.mouseCasterToggle.innerHTML = 'Enable Mouse Casting';
    this.mouseCasterToggle.addEventListener('click', this.toggleMouseCasting.bind(this));
  }

  private toggleOrbitControls(): void {
    if (this.orbitController.enabled) {
      this.orbitController.disable();
      this.orbitControllerToggle.innerHTML = 'Enable Orbit Controller';
      this.raytracer.canvas.style.cursor = 'default';
    } else {
      this.orbitController.enable();
      this.orbitControllerToggle.innerHTML = 'Disable Orbit Controller';
      this.raytracer.canvas.style.cursor = 'move';
    }
  }

  private toggleMouseCasting(): void {
    if (this.mouseCaster.enabled) {
      this.mouseCaster.disable();
      this.mouseCasterToggle.innerHTML = 'Enable Mouse Casting';
    } else {
      this.mouseCaster.enable();
      this.mouseCasterToggle.innerHTML = 'Disable Mouse Casting';
    }
  }
}
