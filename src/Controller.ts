import {
  ORBIT_CONTROLLER_INSTRUCTIONS,
  MOUSE_CASTER_CONTROLLER,
} from './lib/constants';
import Raytracer from './Raytracer';
import OrbitController from './OrbitController';
import MouseCaster from './MouseCaster';

export default class Controller {
  private raytracer: Raytracer;
  private orbitController: OrbitController;
  private mouseCaster: MouseCaster;
  private orbitControllerToggle: HTMLButtonElement;
  private mouseCasterToggle: HTMLButtonElement;
  private hoverModal: HTMLDivElement;
  private mouseIsInsideHoverModal: boolean;

  constructor(raytracer: Raytracer) {
    this.raytracer = raytracer;
    this.orbitController = new OrbitController(raytracer);
    this.mouseCaster = new MouseCaster(raytracer);

    this.orbitControllerToggle = <HTMLButtonElement>document.getElementById('orbit-control-toggle');
    this.orbitControllerToggle.addEventListener('click', this.toggleOrbitControls.bind(this));
    this.orbitControllerToggle.addEventListener('mouseenter', this.displayHoverModal.bind(this));
    this.orbitControllerToggle.addEventListener('mouseleave', this.hideHoverModal.bind(this));

    this.mouseCasterToggle = <HTMLButtonElement>document.getElementById('mouse-caster-toggle');
    this.mouseCasterToggle.addEventListener('click', this.toggleMouseCasting.bind(this));
    this.mouseCasterToggle.addEventListener('mouseenter', this.displayHoverModal.bind(this));
    this.mouseCasterToggle.addEventListener('mouseleave', this.hideHoverModal.bind(this));

    this.hoverModal = <HTMLDivElement>document.getElementById('hover-modal');
    this.hoverModal.addEventListener('mouseenter', () => this.mouseIsInsideHoverModal = true);
    this.hoverModal.addEventListener('mouseleave', () => {
      this.mouseIsInsideHoverModal = false;
      this.hideHoverModal.bind(this);
    });
  }

  private displayHoverModal(event: MouseEvent): void {
    let left: number;
    let right: number;
    let top: number;
    let innerHTML: string;

    if (window.innerWidth - event.clientX > 220) left = event.clientX + 10;
    else right = (window.innerWidth - event.clientX) + 10;
    top = event.clientY;
    innerHTML = event.srcElement.id === 'orbit-control-toggle' ? ORBIT_CONTROLLER_INSTRUCTIONS : MOUSE_CASTER_CONTROLLER;

    this.hoverModal.style.display = 'block';
    this.hoverModal.style.left = left ? left + 'px' : undefined;
    this.hoverModal.style.right = right ? right + 'px' : undefined;
    this.hoverModal.style.top = top + 'px';
    this.hoverModal.innerHTML = innerHTML;
  }

  private hideHoverModal(): void {
    if (!this.mouseIsInsideHoverModal) this.hoverModal.style.display = 'none';
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
