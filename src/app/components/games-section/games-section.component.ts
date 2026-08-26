import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GamesSectionContent } from '../../models/content.models';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-games-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './games-section.component.html',
  styleUrl: './games-section.component.css',
  imports: [
    NgForOf
  ]
})
export class GamesSectionComponent {
  readonly content = input.required<GamesSectionContent>();
}
