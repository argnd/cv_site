/**
 * The custom property every parallaxed layer reads (see `styles/hills.css`,
 * `styles/parallax.css` and the nebula rules in `styles/stars.css`).
 */
const SCROLL_SHIFT_PROPERTY = '--scroll-shift';

/**
 * Every layer that reads {@link SCROLL_SHIFT_PROPERTY}, in one selector.
 *
 * All of them are **day-only** scenery — the clouds, birds and hills are gated
 * off with `opacity: 0` at night — which is what lets the whole loop be shut
 * down by {@link ScrollParallax.setEnabled} when night is up. The night sky's
 * own parallax is a scroll-driven CSS animation instead (see the nebula rules
 * in `styles/stars.css`), so it never needs this.
 *
 * The property is registered as **non-inherited** and written to each of these
 * elements directly rather than once at the top of the scene. Setting an
 * inherited custom property on `.sky` re-resolves the style of every descendant
 * on every frame, and `.sky` holds a few hundred of them: the clouds, birds,
 * hills and cats are SVG trees whose every fill and stroke is a `var()` that
 * then has to be substituted again. A dozen-odd `setProperty` calls are far
 * cheaper than that subtree walk, and they touch only elements that were going
 * to be restyled anyway.
 */
const PARALLAX_SELECTOR = '.cloud, .bird-flock, .hill, .hill-prop';

/** `.hill` and the props are SVG, so this cannot narrow to `HTMLElement`. */
type StyledElement = Element & ElementCSSInlineStyle;

/**
 * Decimal places the eased progress is written with. The largest offset any
 * layer multiplies it by is 62px, so three places already resolve to well under
 * a tenth of a pixel — more than that is just extra parsing per frame.
 */
const WRITE_PRECISION = 3;

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
 * Feeds the day scenery an eased 0..1 progress through the page, giving it its
 * own parallax cue on top of whatever each layer is already animating.
 *
 * The eased value is written **straight to the target elements** rather than
 * through a signal: a signal write per frame drags Angular's change detection
 * into the animation loop for a value no template logic depends on. This is a
 * pure paint concern, which is why it stays out of the framework — and why this
 * module imports nothing from Angular.
 *
 * Nothing here runs at night. `.sky` is `position: fixed`, and Firefox scrolls
 * on the compositor: a main-thread style write mid-scroll forces a paint that
 * has to be reconciled against the async scroll offset, which nudges the fixed
 * sky a fraction of a pixel and makes the star field judder. Since every layer
 * this drives is day-only anyway, the listeners come off entirely instead.
 */
export class ScrollParallax {
  private target = 0;
  private current = 0;
  private rafId: number | null = null;
  private lastFrameAt = 0;
  private targets: readonly StyledElement[] = [];
  private lastWritten: string | null = null;
  private started = false;
  private enabled = true;
  private listening = false;

  /**
   * @param resolveRoot Looks up the element the parallaxed layers live under.
   *   Resolved lazily so the loop can be wired up before the view exists.
   */
  constructor(private readonly resolveRoot: () => HTMLElement | undefined) {}

  /**
   * Begins tracking scroll and resize, and settles the scene on the current
   * position immediately.
   *
   * @returns The teardown, to hand to a `DestroyRef`.
   */
  start(): () => void {
    this.started = true;
    this.reconcile();

    return () => {
      this.started = false;
      this.reconcile();
    };
  }

  /**
   * Turns the loop on and off with the theme. Everything it drives is day-only
   * scenery, so at night there is genuinely nothing to move — see the class
   * note for why staying subscribed would cost more than it looks.
   */
  setEnabled(enabled: boolean): void {
    if (enabled === this.enabled) {
      return;
    }

    this.enabled = enabled;
    this.reconcile();
  }

  /** Brings the listeners in line with `started && enabled`. Idempotent. */
  private reconcile(): void {
    const shouldListen = this.started && this.enabled;
    if (shouldListen === this.listening) {
      return;
    }
    this.listening = shouldListen;

    if (shouldListen) {
      window.addEventListener('scroll', this.syncTarget, { passive: true });
      window.addEventListener('resize', this.syncTarget, { passive: true });
      /* Snap rather than ease in: `current` is wherever the scene was parked
         when the loop last stopped, and gliding from a stale offset would show
         as the scenery sliding into place behind the theme cross-fade. */
      this.readTarget();
      this.current = this.target;
      this.write();
      return;
    }

    window.removeEventListener('scroll', this.syncTarget);
    window.removeEventListener('resize', this.syncTarget);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private readTarget(): void {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    this.target = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }

  private readonly syncTarget = (): void => {
    this.readTarget();
    this.ease();
  };

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

  /**
   * The layers are built from static data and never added or removed, so this
   * resolves once. Nothing is cached until the query actually finds something,
   * so an early call cannot poison the cache with an empty list.
   */
  private collectTargets(): readonly StyledElement[] {
    if (this.targets.length === 0) {
      const root = this.resolveRoot();
      if (root) {
        this.targets = Array.from(root.querySelectorAll<StyledElement>(PARALLAX_SELECTOR));
      }
    }

    return this.targets;
  }

  private write(): void {
    const targets = this.collectTargets();
    if (targets.length === 0) {
      return;
    }

    /* Rounding first means a settling tail that is still moving in the sixth
       decimal writes nothing at all — the eased value converges long before it
       stops changing. */
    const value = this.current.toFixed(WRITE_PRECISION);
    if (value === this.lastWritten) {
      return;
    }
    this.lastWritten = value;

    for (const target of targets) {
      target.style.setProperty(SCROLL_SHIFT_PROPERTY, value);
    }
  }
}
