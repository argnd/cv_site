import { Component, input } from '@angular/core';
import { SkillsSectionContent } from '../../content/content.models';

@Component({
  selector: 'app-skills-section',
  templateUrl: './skills-section.component.html',
  styleUrl: './skills-section.component.css',
})
export class SkillsSectionComponent {
  readonly content = input.required<SkillsSectionContent>();
}
