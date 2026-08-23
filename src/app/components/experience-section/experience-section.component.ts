import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ExperienceSectionContent } from '../../models/content.models';

@Component({
  selector: 'app-experience-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './experience-section.component.html',
  styleUrl: './experience-section.component.css',
})
export class ExperienceSectionComponent {
  readonly content = input.required<ExperienceSectionContent>();
  protected readonly selectedExperience = signal(0);
  protected readonly areHighlightsExpanded = signal(false);
  protected readonly selectedItem = computed(() => this.content().items[this.selectedExperience()]);

  protected selectExperience(index: number): void {
    this.selectedExperience.set(index);
    this.areHighlightsExpanded.set(false);
  }

  protected toggleHighlights(): void {
    this.areHighlightsExpanded.update((value) => !value);
  }
}
