import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { AboutSectionContent } from '../../models/content.models';

@Component({
  selector: 'app-about-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.css',
})
export class AboutSectionComponent {
  readonly content = input.required<AboutSectionContent>();
  protected readonly isExpanded = signal(false);

  protected toggleExpanded(): void {
    this.isExpanded.update((value) => !value);
  }
}
