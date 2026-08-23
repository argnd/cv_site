import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LocaleSelectorContent, SupportedLocale } from '../../models/content.models';

@Component({
  selector: 'app-locale-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './locale-selector.component.html',
  styleUrl: './locale-selector.component.css',
})
export class LocaleSelectorComponent {
  readonly currentLocale = input.required<SupportedLocale>();
  readonly content = input.required<LocaleSelectorContent>();
  readonly localeChange = output<SupportedLocale>();

  protected selectLocale(locale: SupportedLocale): void {
    if (locale !== this.currentLocale()) {
      this.localeChange.emit(locale);
    }
  }
}
