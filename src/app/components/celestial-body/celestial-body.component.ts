import { Component } from '@angular/core';

/**
 * Decorative moon / sun disc. Renders both the night (crater relief) and day
 * (granulation + corona) layers at all times and cross-fades between them
 * purely via CSS, driven by the `.is-day` class the parent (app.html) toggles
 * on this component's host — mirroring the `.scene.is-day` pattern used for
 * the rest of the sky. No inputs needed: it never has to branch in the
 * template, only in the stylesheet.
 */
@Component({
  selector: 'app-celestial-body',
  templateUrl: './celestial-body.component.html',
  styleUrl: './celestial-body.component.css',
})
export class CelestialBodyComponent {}
