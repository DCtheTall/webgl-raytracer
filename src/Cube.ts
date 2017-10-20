import Vector from './Vector';

export default class Cube {
  private minExtent: Vector;
  private maxExtent: Vector;
  private thetaY: number;

  constructor(x: number, y: number, z: number) {
    this.minExtent = new Vector(-(x / 2), 0, -(z / 2));
    this.maxExtent = new Vector((x / 2), y, (z / 2));
    this.thetaY = 0;
  }

  public getMinExtent(): number[] {
    return this.minExtent.getElements();
  }

  public getMaxExtent(): number[] {
    return this.maxExtent.getElements();
  }
}
