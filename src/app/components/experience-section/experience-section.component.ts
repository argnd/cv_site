import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import { ExperienceSectionContent } from '../../models/content.models';

/** How each key moves the selection, relative to the tab it was pressed on. */
const TAB_KEY_MOVES: Record<string, 'previous' | 'next' | 'first' | 'last'> = {
  ArrowLeft: 'previous',
  ArrowUp: 'previous',
  ArrowRight: 'next',
  ArrowDown: 'next',
  Home: 'first',
  End: 'last',
};

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

  private readonly tabs = viewChildren<ElementRef<HTMLButtonElement>>('tab');

  protected selectExperience(index: number): void {
    this.selectedExperience.set(index);
    /* Each job's details are its own; carrying the previous one's expanded
       state over would drop the reader mid-list of someone else's bullets. */
    this.areHighlightsExpanded.set(false);
  }

  /**
   * Arrow-key navigation across the tab list, per the ARIA authoring practices:
   * the list is a single tab stop, the arrows move within it, and moving the
   * focus selects — the panels are already in the document, so there is nothing
   * to load and no reason to make the reader confirm.
   */
  protected onTabKeydown(event: KeyboardEvent, index: number): void {
    const move = TAB_KEY_MOVES[event.key];
    if (move === undefined) {
      return;
    }

    const lastIndex = this.content().items.length - 1;
    const target = {
      previous: index === 0 ? lastIndex : index - 1,
      next: index === lastIndex ? 0 : index + 1,
      first: 0,
      last: lastIndex,
    }[move];

    /* Otherwise the arrows would also scroll the page out from under the list. */
    event.preventDefault();
    this.selectExperience(target);
    this.tabs()[target]?.nativeElement.focus();
  }

  protected toggleHighlights(): void {
    this.areHighlightsExpanded.update((value) => !value);
  }
}
