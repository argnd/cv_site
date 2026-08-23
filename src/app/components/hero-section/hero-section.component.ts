import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HeroSectionContent } from '../../models/content.models';

@Component({
  selector: 'app-hero-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent {
  readonly content = input.required<HeroSectionContent>();

  protected onProjectsClick(event: MouseEvent): void {
    event.preventDefault();

    const nextPath = '/project';
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }

    document.getElementById('games')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
