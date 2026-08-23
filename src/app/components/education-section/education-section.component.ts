import { Component, input } from '@angular/core';
import { EducationSectionContent } from '../../content/content.models';

@Component({
  selector: 'app-education-section',
  templateUrl: './education-section.component.html',
  styleUrl: './education-section.component.css',
})
export class EducationSectionComponent {
  readonly content = input.required<EducationSectionContent>();
}
