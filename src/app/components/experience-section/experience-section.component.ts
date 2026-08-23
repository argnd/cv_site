import { Component, computed, input, signal } from '@angular/core';
import { ExperienceItem } from '../../content/content.models';

@Component({
  selector: 'app-experience-section',
  templateUrl: './experience-section.component.html',
  styleUrl: './experience-section.component.css',
})
export class ExperienceSectionComponent {
  readonly items = input.required<ExperienceItem[]>();
  protected readonly selectedExperience = signal(0);
  protected readonly selectedItem = computed(() => this.items()[this.selectedExperience()]);

  protected selectExperience(index: number): void {
    this.selectedExperience.set(index);
  }
}
