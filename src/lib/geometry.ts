import Vector from '../Vector';
import Quaternion from '../Quaternion';

export function intersectSphere(
  rayStart: Vector,
  rayDirection: Vector,
  spherePosition: Vector,
  sphereRadius: number
): number {
  let at: Vector;
  let v: number;
  let dist: number;
  let disc: number;

  at = Vector.subtract(spherePosition, rayStart);
  v = Vector.dot(at, rayDirection);
  dist = -1;
  if (v >= 0) {
    disc = (sphereRadius ** 2) - (Vector.dot(at, at) - (v * v));
    if (disc > 0) dist = v - (disc ** 0.5);
  }

  return dist;
}

export function intersectCube(
  rayStart: Vector,
  rayDirection: Vector,
  cubeMinExtent: Vector,
  cubeMaxExtent: Vector,
  cubeRotationInverse: Quaternion,
  cubePosition: Vector
): number {
  let start: Vector;
  let direction: Vector;
  let tNear: number;
  let tFar: number;
  let tMin: Vector;
  let tMax: Vector;
  let tEnter: number;
  let tExit: number;

  start = Vector.subtract(rayStart, cubePosition);
  start = Vector.applyRotationQuaternion(start, cubeRotationInverse);
  direction = Vector.applyRotationQuaternion(rayDirection, cubeRotationInverse);
  tNear = -Infinity;
  tFar = Infinity;
  tMin = Vector.divide(Vector.subtract(cubeMinExtent, start), direction);
  tMax = Vector.divide(Vector.subtract(cubeMaxExtent, start), direction);

  tEnter = Math.min(tMin.x, tMax.x);
  tExit = Math.max(tMin.x, tMax.x);
  if (tEnter > tNear) tNear = tEnter;
  if (tExit < tFar) tFar = tExit;

  tEnter = Math.min(tMin.y, tMax.y);
  tExit = Math.max(tMin.y, tMax.y);
  if (tEnter > tNear) tNear = tEnter;
  if (tExit < tFar) tFar = tExit;

  tEnter = Math.min(tMin.z, tMax.z);
  tExit = Math.max(tMin.z, tMax.z);
  if (tEnter > tNear) tNear = tEnter;
  if (tExit < tFar) tFar = tExit;

  if (tNear < tFar) return tNear;
  return -1;
}
