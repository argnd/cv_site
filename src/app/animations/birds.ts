import { Flock } from '../models/scene.models';

/**
 * The birds that cross the daytime sky: one trio in a V, one lone straggler.
 * The straggler is the one a narrow viewport drops — the V is the shape worth
 * keeping, and one crossing at a time is plenty over full-width copy. The V
 * itself thins to a pair there: three birds shrunk to 0.76 read as a smudge
 * over body text, while two still read as a formation.
 */
export const BIRD_FLOCKS: readonly Flock[] = [
  {
    top: 16,
    delay: -4,
    duration: 27,
    rest: 30,
    members: [
      { dx: 0, dy: 0, width: 48, flap: 1.5, flapShift: 0, soar: 0 },
      { dx: -40, dy: -23, width: 42, flap: 1.34, flapShift: -0.52, soar: -1.7 },
      /* The trailing bird is the one that goes: it is the lowest of the three,
         so dropping it also lifts the pair away from the copy below. */
      { dx: -43, dy: 21, width: 40, flap: 1.62, flapShift: -0.95, soar: -3.1, wideOnly: true },
    ],
  },
  {
    top: 34,
    delay: 13,
    duration: 31,
    rest: 68,
    wideOnly: true,
    members: [{ dx: 0, dy: 0, width: 44, flap: 1.44, flapShift: -0.3, soar: -2.2 }],
  },
];
