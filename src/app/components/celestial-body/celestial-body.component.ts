import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Decorative moon / sun disc. Renders both the night (photographic moon) and
 * day (flat-vector sun) layers at all times and cross-fades between them purely
 * via CSS, driven by the `.is-day` class the parent (app.html) toggles on this
 * component's host — mirroring the `.scene.is-day` pattern used for the rest of
 * the sky. It never has to branch in the template, only in the stylesheet.
 *
 * The two skins are deliberately drawn in different languages: night aims for
 * astro-photographic realism, day for bold flat illustration.
 */
@Component({
  selector: 'app-celestial-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './celestial-body.component.html',
  styleUrl: './celestial-body.component.css',
})
export class CelestialBodyComponent {
  /** Eight evenly spaced flame rays; each `.ray` path is the same silhouette
   * rotated about the SVG's center, so the shape only has to be authored once. */
  protected readonly rayAngles: number[] = Array.from({ length: 8 }, (_, i) => i * 45);
}
