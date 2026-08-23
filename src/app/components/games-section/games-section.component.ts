import { Component, input } from '@angular/core';
import { GamesSectionContent } from '../../content/content.models';

@Component({
  selector: 'app-games-section',
  templateUrl: './games-section.component.html',
  styleUrl: './games-section.component.css',
})
export class GamesSectionComponent {
  readonly content = input.required<GamesSectionContent>();
}
