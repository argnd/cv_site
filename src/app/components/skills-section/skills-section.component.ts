import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkillsSectionContent } from '../../models/content.models';

@Component({
  selector: 'app-skills-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills-section.component.html',
  styleUrl: './skills-section.component.css',
})
export class SkillsSectionComponent {
  readonly content = input.required<SkillsSectionContent>();
}
