import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HeroSectionContent } from '../../models/content.models';
import { navigateToSection } from '../../navigation/section-route';

@Component({
  selector: 'app-hero-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent {
  readonly content = input.required<HeroSectionContent>();

  /** The games section's URL, already localized by the shell. */
  readonly gamesPath = input.required<string>();

  /**
   * The link is a real `href`, so it still opens in a new tab and still shows
   * its target in the status bar. A plain click is handled in-page instead, to
   * keep the scroll and the sky where they are.
   */
  protected onProjectsClick(event: MouseEvent): void {
    event.preventDefault();
    navigateToSection(this.gamesPath());
  }
}
