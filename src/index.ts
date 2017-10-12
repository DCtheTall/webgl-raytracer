import RayTracer from './Raytracer';

function main() {
  let canvas: HTMLCanvasElement;
  let sideLength: number;
  let raytracer: RayTracer;

  canvas = <HTMLCanvasElement>document.getElementById('webgl-canvas');
  sideLength = window.innerWidth > 550 ? 500 : 300;
  canvas.width = sideLength;
  canvas.height = sideLength;
  raytracer = new RayTracer(canvas);
  raytracer.loadShaders();
}

main();
