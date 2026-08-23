import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HeroSectionContent } from '../../models/content.models';
import { GAMES_PATH, navigateToSection } from '../../navigation/section-route';

@Component({
  selector: 'app-hero-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent {
  readonly content = input.required<HeroSectionContent>();

  protected readonly gamesPath = GAMES_PATH;

  /**
   * The link is a real `href`, so it still opens in a new tab and still shows
   * its target in the status bar. A plain click is handled in-page instead, to
   * keep the scroll and the sky where they are.
   */
  protected onProjectsClick(event: MouseEvent): void {
    event.preventDefault();
    navigateToSection(GAMES_PATH);
  }
}
