/**
 * The custom property every parallaxed layer reads. One rule in
 * `styles/parallax.css` turns it into the actual offset; the layer stylesheets
 * only supply their own `--parallax-*` distances.
 */
const SCROLL_SHIFT_PROPERTY = '--scroll-shift';

/**
 * Every layer that reads {@link SCROLL_SHIFT_PROPERTY}, in one selector — the
 * same list the rule at the top of `styles/parallax.css` carries, so the two
 * have to be kept in step.
 *
 * The property is registered as **non-inherited** and written to each of these
 * elements directly rather than once at the top of the scene. Setting an
 * inherited custom property on `.sky` re-resolves the style of every descendant
 * on every frame, and `.sky` holds a few hundred of them: the clouds, birds,
 * hills and cats are SVG trees whose every fill and stroke is a `var()` that
 * then has to be substituted again. A couple of dozen `setProperty` calls are
 * far cheaper than that subtree walk, and they touch only elements that were
 * going to be restyled anyway.
 */
const PARALLAX_SELECTOR = '.cloud, .bird-flock, .hill, .hill-prop, .sky__nebula';

/** `.hill` and the props are SVG, so this cannot narrow to `HTMLElement`. */
type StyledElement = Element & ElementCSSInlineStyle;

/**
 * Decimal places the progress is written with. The largest offset any layer
 * multiplies it by is 62px, so three places already resolve to well under a
 * tenth of a pixel — more than that is just extra parsing per frame.
 */
const WRITE_PRECISION = 3;

/**
 * Feeds the scenery its 0..1 progress through the page, giving every parallaxed
 * layer a scroll cue on top of whatever it is already animating.
 *
 * The value is written **straight to the target elements** rather than through a
 * signal: a signal write per frame drags Angular's change detection into the
 * animation loop for a value no template logic depends on. This is a pure paint
 * concern, which is why it stays out of the framework — and why this module
 * imports nothing from Angular.
 *
 * The offset is deliberately *not* smoothed. Across a full page the largest
 * layer travels 62px, so a mouse-wheel step moves the scenery by a fraction of a
 * pixel: an eased chase of the scroll position cost a rAF loop that kept running
 * after the scroll stopped, and bought motion nobody can see. Locking the layers
 * to the scroll position also removes the trailing that read as lag.
 */
export class ScrollParallax {
  private targets: readonly StyledElement[] = [];
  private lastWritten: string | null = null;
  private frame: number | null = null;

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
    window.addEventListener('scroll', this.schedule, { passive: true });
    window.addEventListener('resize', this.schedule, { passive: true });
    this.write();

    return () => {
      window.removeEventListener('scroll', this.schedule);
      window.removeEventListener('resize', this.schedule);
      if (this.frame !== null) {
        cancelAnimationFrame(this.frame);
        this.frame = null;
      }
    };
  }

  /**
   * Coalesces a burst of events into one write per frame. A scroll can fire
   * several times between two paints, and every one of them would otherwise
   * restyle the same elements for a value that is read once.
   */
  private readonly schedule = (): void => {
    if (this.frame !== null) {
      return;
    }

    this.frame = requestAnimationFrame(() => {
      this.frame = null;
      this.write();
    });
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

    /* Read from inside the frame callback, where the previous frame's layout is
       still clean — the same read on every scroll event would force one sync
       reflow per event instead. */
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    /* Rounding before the compare means the tail of a smooth scroll, still
       moving in the sixth decimal, writes nothing at all. */
    const value = progress.toFixed(WRITE_PRECISION);
    if (value === this.lastWritten) {
      return;
    }
    this.lastWritten = value;

    for (const target of targets) {
      target.style.setProperty(SCROLL_SHIFT_PROPERTY, value);
    }
  }
}
