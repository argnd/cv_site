import { Component, input } from '@angular/core';
import { HeroSectionContent } from '../../content/content.models';

@Component({
  selector: 'app-hero-section',
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
