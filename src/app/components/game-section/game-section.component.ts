import { Component, input } from '@angular/core';
import { GameSectionContent } from '../../content/content.models';

@Component({
  selector: 'app-game-section',
  templateUrl: './game-section.component.html',
  styleUrl: './game-section.component.css',
})
export class GameSectionComponent {
  readonly content = input.required<GameSectionContent>();
}
