import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EducationSectionContent } from '../../models/content.models';

@Component({
  selector: 'app-education-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './education-section.component.html',
  styleUrl: './education-section.component.css',
})
export class EducationSectionComponent {
  readonly content = input.required<EducationSectionContent>();
}
