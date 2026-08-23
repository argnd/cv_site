import { ShootingStar, ShootingStarPath, Star } from '../models/scene.models';
import { randomBetween } from './random';

/** The hand-placed twinkling star field. */
export const HERO_STARS: readonly Star[] = [
  { top: 8, left: 14, size: 2, delay: 0, duration: 4.6, variant: 'pulse' },
  { top: 16, left: 78, size: 3, delay: 0.6, duration: 5.2, variant: 'glint' },
  { top: 28, left: 46, size: 2, delay: 1.2, duration: 3.8, variant: 'drift' },
  { top: 11, left: 60, size: 2, delay: 1.8, duration: 4.9, variant: 'pulse' },
  { top: 38, left: 22, size: 3, delay: 0.3, duration: 5.6, variant: 'glint' },
  { top: 5, left: 36, size: 2, delay: 2.1, duration: 4.2, variant: 'drift' },
  { top: 21, left: 90, size: 2, delay: 1.4, duration: 3.6, variant: 'pulse' },
  { top: 46, left: 70, size: 2, delay: 0.9, duration: 5.0, variant: 'glint' },
  { top: 14, left: 5, size: 3, delay: 2.6, duration: 4.4, variant: 'drift' },
  { top: 33, left: 55, size: 2, delay: 1.6, duration: 3.9, variant: 'pulse' },
  { top: 3, left: 85, size: 2, delay: 0.4, duration: 4.7, variant: 'glint' },
  { top: 24, left: 30, size: 2, delay: 2.0, duration: 5.4, variant: 'drift' },
];

/** Enough for the odd streak to catch the eye, few enough that it stays an event. */
const SHOOTING_STAR_COUNT = 3;

/**
 * Derives the flight vector (dx/dy) and the comet trail's rotation from a single
 * direction of travel, so the trail always points exactly opposite the way the
 * star is actually moving, however it's angled.
 */
function createShootingStar(path: ShootingStarPath): ShootingStar {
  const radians = (path.angle * Math.PI) / 180;
  return {
    ...path,
    dx: Math.cos(radians) * path.distance,
    dy: Math.sin(radians) * path.distance,
    trailAngle: path.angle + 180,
  };
}

/**
 * Builds shooting stars with randomized (but constrained) flight paths.
 * `.sky` is `position: fixed`, so a star's on-screen spot never changes with
 * scroll — meaning "avoid the text" can't just mean "avoid the hero
 * heading," it has to hold at any scroll position. The one thing that stays
 * constant everywhere is that page copy always lives in the centered
 * ~720px `.page` column, so each star spawns in the left/right margin
 * outside it and is only allowed to travel further toward its own edge
 * (angle biased away from center), never sweeping back across the middle.
 * Zones alternate by index so a small batch doesn't randomly cluster on one
 * side; everything else (offset, angle, timing, distance) is randomized for
 * genuinely varied trajectories star to star.
 */
export function createShootingStars(count: number = SHOOTING_STAR_COUNT): ShootingStar[] {
  return Array.from({ length: count }, (_, i) => {
    const zone: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right';
    const left = zone === 'left' ? randomBetween(3, 20) : randomBetween(80, 97);
    const angle = zone === 'left' ? randomBetween(105, 255) : randomBetween(-75, 75);

    return createShootingStar({
      top: randomBetween(4, 52),
      left,
      delay: randomBetween(0, 16),
      duration: randomBetween(9, 13.5),
      angle,
      distance: randomBetween(170, 300),
    });
  });
}
