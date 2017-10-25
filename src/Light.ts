import Vector from './Vector';

export default interface Light {
  position: Vector;
  color: number[];
  intensity: number;
}
