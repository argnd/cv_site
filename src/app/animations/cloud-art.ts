import { CloudFace, CloudShape } from '../models/scene.models';

/**
 * The cloud silhouettes. See {@link CloudShape} for how they're drawn and what
 * `faceAt` anchors.
 */
export const CLOUD_SHAPES = {
  /** Four lobes, tallest just left of centre — the default cloud. */
  wide: {
    d: 'M34 88 A26 26 0 1 1 54.2 40.1 A34 34 0 0 1 120.4 33.6 A28 28 0 0 1 161.2 51.2 A20 20 0 0 1 176.7 88 Z',
    faceAt: '95,63',
  },
  /** Three lobes, symmetric about the centre. */
  dome: {
    d: 'M42.1 88 A26 26 0 0 1 64.2 41.3 A34 34 0 1 1 131.8 41.3 A26 26 0 0 1 153.9 88 Z',
    faceAt: '98,62',
  },
  /** Five lobes — the long, rolling one. */
  ridge: {
    d: 'M25.3 88 A20 20 0 1 1 44.5 53 A26 26 0 0 1 83.8 36 A28 28 0 0 1 134.5 40.9 A24 24 0 0 1 169.5 57.3 A17 17 0 1 1 183.7 88 Z',
    faceAt: '100,64',
  },
  /** Four shallow lobes — the flattest of the set. */
  low: {
    d: 'M40.8 88 A22 22 0 0 1 58.3 47.6 A28 28 0 0 1 111.2 39.7 A24 24 0 0 1 146.9 52.7 A20 20 0 0 1 164 88 Z',
    faceAt: '100,64',
  },
  /** Asymmetric tower, rising toward the right. */
  tower: {
    d: 'M44.7 88 A24 24 0 0 1 62 44.3 A30 30 0 0 1 105.6 19.3 A24 24 0 0 1 149.6 36.3 A28 28 0 0 1 168.4 88 Z',
    faceAt: '92,66',
  },
  /** Two lobes only — the small, simple puff of the set. */
  puff: {
    d: 'M56.1 88 A26 26 0 1 1 90 49.3 A30 30 0 1 1 128.8 88 Z',
    faceAt: '95,66',
  },
  /** Heavy, flat-bottomed storm cloud — the one that rains. */
  storm: {
    d: 'M36.4 88 A24 24 0 1 1 56.9 44.6 A30 30 0 0 1 109.3 33.1 A28 28 0 0 1 155.3 47.8 A22 22 0 0 1 173.2 88 Z',
    faceAt: '100,64',
  },
} satisfies Record<string, CloudShape>;

/** The expressions a cloud can wear. See {@link CloudFace} for the coordinate space. */
export const FACES = {
  happy: { eyes: 'M-13 -2l.01 0M13 -2l.01 0', eyeWidth: 7.4, mouth: 'M-8 5Q0 13 8 5' },
  closed: { lids: 'M-17 1Q-12 -6 -7 1M7 1Q12 -6 17 1', mouth: 'M-5 6Q0 11 5 6' },
  sleepy: { lids: 'M-16 -2Q-11 4 -6 -2M6 -2Q11 4 16 -2', mouth: 'M-4 7Q0 10.5 4 7' },
  oh: {
    eyes: 'M-13 -3l.01 0M13 -3l.01 0',
    eyeWidth: 7.4,
    mouth: 'M0 4a3.4 4.6 0 1 0 .01 0',
    mouthFilled: true,
  },
  wink: {
    eyes: 'M13 -2l.01 0',
    eyeWidth: 7.4,
    lids: 'M-17 -1Q-12 -8 -7 -1',
    mouth: 'M-8 5Q0 13 8 5',
  },
  grin: {
    eyes: 'M-14 -3l.01 0M14 -3l.01 0',
    eyeWidth: 7,
    mouth: 'M-11 4Q0 16 11 4',
    mouthFilled: true,
  },
  sad: {
    eyes: 'M-12 0l.01 0M12 0l.01 0',
    eyeWidth: 6.6,
    /** Inner ends raised — the difference between worried and angry. */
    brows: 'M-19 -9L-8 -13M19 -9L8 -13',
    mouth: 'M-8 11Q0 3 8 11',
  },
} satisfies Record<string, CloudFace>;

/** Teardrop: a point at the origin, straight down into a semicircular bottom. */
export const RAINDROP_PATH = 'M0 0Q3 5 3 7.4A3 3 0 1 1 -3 7.4Q-3 5 0 0Z';
