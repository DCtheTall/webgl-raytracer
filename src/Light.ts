import Vector from './Vector';

export interface LightInterface {
  position: Vector;
  color: number[];
}

export default class Light implements LightInterface {
  public position: Vector;
  public color: number[];

  constructor(params: LightInterface) {
    this.position = params.position;
    this.color = params.color;
  }
}
