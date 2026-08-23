import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FooterSectionContent } from '../../models/content.models';

@Component({
  selector: 'app-footer-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer-section.component.html',
  styleUrl: './footer-section.component.css',
})
export class FooterSectionComponent {
  readonly content = input.required<FooterSectionContent>();
  protected readonly currentYear = new Date().getFullYear();
}
