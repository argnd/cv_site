import { Flock } from '../models/scene.models';

/** The birds that cross the daytime sky: one trio in a V, one lone straggler. */
export const BIRD_FLOCKS: readonly Flock[] = [
  {
    top: 16,
    delay: -4,
    duration: 27,
    rest: 30,
    members: [
      { dx: 0, dy: 0, width: 48, flap: 1.5, flapShift: 0, soar: 0 },
      { dx: -40, dy: -23, width: 42, flap: 1.34, flapShift: -0.52, soar: -1.7 },
      { dx: -43, dy: 21, width: 40, flap: 1.62, flapShift: -0.95, soar: -3.1 },
    ],
  },
  {
    top: 34,
    delay: 13,
    duration: 31,
    rest: 68,
    members: [{ dx: 0, dy: 0, width: 44, flap: 1.44, flapShift: -0.3, soar: -2.2 }],
  },
];
