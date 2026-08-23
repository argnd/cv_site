import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GamesSectionContent } from '../../models/content.models';

@Component({
  selector: 'app-games-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './games-section.component.html',
  styleUrl: './games-section.component.css',
})
export class GamesSectionComponent {
  readonly content = input.required<GamesSectionContent>();
}
