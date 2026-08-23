import { Component, input } from '@angular/core';
import { FooterSectionContent } from '../../content/content.models';

@Component({
  selector: 'app-footer-section',
  templateUrl: './footer-section.component.html',
  styleUrl: './footer-section.component.css',
})
export class FooterSectionComponent {
  readonly content = input.required<FooterSectionContent>();
  protected readonly currentYear = new Date().getFullYear();
}
