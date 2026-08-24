import { Cloud, Raindrop } from '../models/scene.models';
import { CLOUD_SHAPES, FACES } from './cloud-art';
import { randomBetween } from './random';

/**
 * `cloud-drift-rare` parks the storm cloud until 82% of its 300s cycle, so the
 * drift itself only starts this far in. Offsetting the delay by it lands the
 * first pass a few seconds after load — a rare cloud nobody ever sees is a
 * wasted one — and every pass after that is one per 5-minute cycle. Delay and
 * duration are both scaled by `--sky-tempo`, so a slower sky stretches that
 * cycle without moving the first pass anywhere else in it.
 */
const RARE_CLOUD_PARKED_SECONDS = 246;

/**
 * Static clouds, in draw order. The storm cloud is appended by
 * {@link createClouds}. The three left unmarked are what a narrow viewport
 * keeps: one per band of the sky, near / far / near, so thinning the set out
 * still leaves depth in it.
 */
const DRIFTING_CLOUDS: readonly Cloud[] = [
  {
    art: CLOUD_SHAPES.wide,
    face: FACES.happy,
    top: 8,
    scale: 1,
    depth: 'near',
    delay: -12,
    duration: 118,
    bob: 0,
    rest: 14,
  },
  {
    art: CLOUD_SHAPES.ridge,
    face: FACES.sleepy,
    top: 21,
    scale: 0.6,
    depth: 'far',
    delay: -95,
    duration: 172,
    bob: -4.5,
    rest: 63,
  },
  {
    art: CLOUD_SHAPES.dome,
    face: FACES.closed,
    top: 4,
    scale: 0.72,
    depth: 'far',
    delay: -55,
    duration: 150,
    bob: -9,
    rest: 88,
    wideOnly: true,
  },
  {
    art: CLOUD_SHAPES.low,
    face: FACES.oh,
    top: 31,
    scale: 0.88,
    depth: 'near',
    delay: -108,
    duration: 130,
    bob: -2,
    rest: 36,
  },
  {
    art: CLOUD_SHAPES.tower,
    face: FACES.wink,
    top: 26,
    scale: 0.78,
    depth: 'near',
    delay: -70,
    duration: 141,
    bob: -11,
    rest: 50,
    wideOnly: true,
  },
  {
    art: CLOUD_SHAPES.puff,
    face: FACES.grin,
    top: 14,
    scale: 0.52,
    depth: 'far',
    delay: -150,
    duration: 190,
    bob: -6.5,
    rest: 76,
    wideOnly: true,
  },
];

/**
 * The full cloud layer. Built per call rather than shared as a constant, because
 * the storm cloud's first appearance is randomized and should be re-rolled every
 * time the scene is set up.
 */
export function createClouds(): Cloud[] {
  return [
    ...DRIFTING_CLOUDS,
    {
      art: CLOUD_SHAPES.storm,
      face: FACES.sad,
      top: 17,
      scale: 0.92,
      depth: 'near',
      delay: randomBetween(8, 45) - RARE_CLOUD_PARKED_SECONDS,
      duration: 300,
      bob: -3,
      rest: 58,
      rare: true,
      rain: true,
    },
  ];
}

/** Irregular delays so the fall reads as rain rather than a marching wave. */
export const RAINDROPS: readonly Raindrop[] = [
  { x: 52, delay: 0 },
  { x: 72, delay: -0.34 },
  { x: 92, delay: -0.13 },
  { x: 112, delay: -0.45 },
  { x: 132, delay: -0.22 },
  { x: 152, delay: -0.07 },
];
