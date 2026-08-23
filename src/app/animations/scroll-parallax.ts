/**
 * The custom property every parallaxed layer reads (see `styles/hills.css` and
 * the `translate` rules at the end of `styles/clouds.css`). Kept as a plain CSS
 * variable rather than per-element inline offsets so one write drives the whole
 * scene.
 */
const SCROLL_SHIFT_PROPERTY = '--scroll-shift';

/**
 * Time constant of the smoothing, in seconds: roughly how long the scenery takes
 * to cover ~63% of the distance to the live scroll position. Low enough that the
 * parallax reads as attached to the page rather than trailing it, high enough to
 * still absorb coarse mouse-wheel steps.
 */
const TAU_SECONDS = 0.08;

/**
 * Longest frame the easing will integrate over. Stops a backgrounded tab
 * resuming with one huge jump.
 */
const MAX_FRAME_SECONDS = 0.05;

/** Below this the remaining distance is sub-pixel — snap, and stop the loop. */
const SETTLED_EPSILON = 0.0005;

/**
 * Feeds the fixed sky an eased 0..1 progress through the page, giving it its own
 * parallax cue on top of whatever each layer is already animating.
 *
 * The eased value is written **straight to the target element** rather than
 * through a signal: a signal write per frame drags Angular's change detection
 * into the animation loop for a value no template logic depends on. This is a
 * pure paint concern, which is why it stays out of the framework — and why this
 * module imports nothing from Angular.
 */
export class ScrollParallax {
  private target = 0;
  private current = 0;
  private rafId: number | null = null;
  private lastFrameAt = 0;

  /**
   * @param resolveTarget Looks up the element the CSS variable is written to.
   *   Resolved lazily on every frame so it can be wired up before the view
   *   exists.
   */
  constructor(private readonly resolveTarget: () => HTMLElement | undefined) {}

  /**
   * Begins tracking scroll and resize, and settles the scene on the current
   * position immediately.
   *
   * @returns The teardown, to hand to a `DestroyRef`.
   */
  start(): () => void {
    const syncTarget = (): void => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.target = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      this.ease();
    };

    window.addEventListener('scroll', syncTarget, { passive: true });
    window.addEventListener('resize', syncTarget, { passive: true });
    syncTarget();

    return () => {
      window.removeEventListener('scroll', syncTarget);
      window.removeEventListener('resize', syncTarget);
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
      }
    };
  }

  /** Starts the easing loop, unless one is already running. */
  private ease(): void {
    if (this.rafId !== null) {
      return;
    }

    this.lastFrameAt = performance.now();
    this.rafId = requestAnimationFrame(this.step);
  }

  private readonly step = (now: number): void => {
    /* Frame-rate independent exponential smoothing. A fixed per-frame factor
       would ease at a different real-world speed on a 60Hz and a 144Hz display;
       deriving it from elapsed time makes the glide identical on both.
       `dt` is clamped at *both* ends. The lower bound matters just as much as
       MAX_FRAME_SECONDS: a rAF timestamp is the frame's start time, so it can
       predate the `performance.now()` taken when the loop was scheduled. That
       negative dt flips the sign of `exp(-dt / TAU)` and throws the scenery
       hundreds of units the wrong way on the first frame of every scroll
       burst. */
    const dt = Math.min(Math.max(now - this.lastFrameAt, 0) / 1000, MAX_FRAME_SECONDS);
    this.lastFrameAt = now;

    const diff = this.target - this.current;
    if (Math.abs(diff) < SETTLED_EPSILON) {
      this.current = this.target;
      this.write();
      this.rafId = null;
      return;
    }

    this.current += diff * (1 - Math.exp(-dt / TAU_SECONDS));
    this.write();
    this.rafId = requestAnimationFrame(this.step);
  };

  private write(): void {
    this.resolveTarget()?.style.setProperty(SCROLL_SHIFT_PROPERTY, this.current.toFixed(4));
  }
}
