import { Component, input } from '@angular/core';
import { AboutSectionContent } from '../../content/content.models';

@Component({
  selector: 'app-about-section',
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.css',
})
export class AboutSectionComponent {
  readonly content = input.required<AboutSectionContent>();
}
