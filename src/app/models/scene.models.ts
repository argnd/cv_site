/**
 * Shape of the decorative sky. Every one of these is inert data handed straight
 * to a template binding: the actual motion is CSS keyframes in
 * `../animations/styles/`, and these values only pick the starting phase,
 * placement and speed of each piece. Nothing here is mutated at runtime.
 */

/* ---------------------------------- */
/* Clouds                              */
/* ---------------------------------- */

/**
 * A cloud silhouette, in the shared `0 0 200 96` viewBox. Each outline is the
 * exact contour of a chain of overlapping circles resting on a common flat
 * baseline, so the lobes meet in true tangent-free arcs — no seams to hide, and
 * the whole shape stays a handful of `A` commands rather than a sampled
 * polyline.
 */
export type CloudShape = {
  d: string;
  /**
   * `"x,y"` the face group is translated to, picked per shape to sit on the
   * body mass rather than drifting onto a lobe.
   */
  faceAt: string;
};

/** An expression, in coordinates local to a shape's `faceAt` anchor. */
export type CloudFace = {
  /** Round-capped zero-length segments — each renders as a dot pupil. */
  eyes?: string;
  eyeWidth?: number;
  /**
   * Closed/curved eyelids. Split from `eyes` so the two can carry different pen
   * weights, which is what lets `wink` pair a 7.4 dot with a 3.4 lid.
   */
  lids?: string;
  brows?: string;
  mouth: string;
  /**
   * Fills the mouth path instead of stroking it, closing an open curve into a
   * solid shape — an open grin or a round "oh".
   */
  mouthFilled?: boolean;
};

export type Cloud = {
  art: CloudShape;
  face: CloudFace;
  /** Vertical position, in % of the viewport. */
  top: number;
  /**
   * Multiplier on the base width. Sizing is width-driven rather than a CSS
   * `scale()`, because an ancestor transform also shrinks the silhouette's
   * "non-scaling" stroke — which would leave far clouds with a hairline.
   */
  scale: number;
  /** Drives fill, outline weight and opacity so size isn't the only depth cue. */
  depth: 'near' | 'far';
  /**
   * Negative, so every cloud is already mid-flight on load instead of the sky
   * starting empty and filling up over the next two minutes.
   */
  delay: number;
  duration: number;
  /** Offsets the vertical bob so the clouds don't rise and fall in lockstep. */
  bob: number;
  /** Where the cloud parks when motion is reduced, in % of the viewport width. */
  rest: number;
  /**
   * Spends most of its cycle parked off-screen rather than drifting the whole
   * time, so it shows up as an occasional event instead of a fixture.
   */
  rare?: boolean;
  rain?: boolean;
};

/** One falling drop under the storm cloud, in the cloud's own viewBox units. */
export type Raindrop = {
  x: number;
  delay: number;
};

/* ---------------------------------- */
/* Stars                               */
/* ---------------------------------- */

/**
 * Selects one of three distinct twinkle motion signatures (see
 * `.star` / `.star--glint` / `.star--drift` in `styles/stars.css`) so the field
 * reads as varied stars rather than one shape repeated with offsets.
 */
export type StarVariant = 'pulse' | 'glint' | 'drift';

export type Star = {
  /** Position, in % of the viewport. */
  top: number;
  left: number;
  /** Diameter, in px. */
  size: number;
  delay: number;
  duration: number;
  variant: StarVariant;
};

/** The inputs a shooting star's flight is derived from. */
export type ShootingStarPath = {
  top: number;
  left: number;
  delay: number;
  duration: number;
  /** Direction of travel in degrees (CSS rotate convention: 0 = right, 90 = down). */
  angle: number;
  /** Flight distance in pixels. */
  distance: number;
};

export type ShootingStar = ShootingStarPath & {
  dx: number;
  dy: number;
  trailAngle: number;
};

/* ---------------------------------- */
/* Birds                               */
/* ---------------------------------- */

export type FlockMember = {
  /** Offset from the flock's leader, in px. */
  dx: number;
  dy: number;
  width: number;
  /**
   * One full flap cycle: three beats plus a glide. Varied per bird so a flock
   * doesn't beat in lockstep.
   */
  flap: number;
  /** Phase offset into that flap cycle, so the beats are staggered too. */
  flapShift: number;
  /** Phase offset for the vertical soar, so members wander independently. */
  soar: number;
};

export type Flock = {
  /** Vertical position, in % of the viewport. */
  top: number;
  delay: number;
  duration: number;
  /** Where the flock parks when motion is reduced, in % of the viewport width. */
  rest: number;
  members: FlockMember[];
};

/* ---------------------------------- */
/* Hill props                          */
/* ---------------------------------- */

/** A cat sitting on the near hill, in the gutter beside the text column. */
export type HillCat = {
  name: string;
  /**
   * Jojo is a brown tabby with white, so he also gets a bib, paws and stripes;
   * Vivi is plain grey.
   */
  tabby: boolean;
  height: number;
  /** Inset from the right edge of the viewport. */
  right: number;
};
