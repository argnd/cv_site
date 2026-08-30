import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  ArmelBotError,
  ArmelBotErrorKind,
  askArmelBot,
  Exchange,
  MAX_EXCHANGES,
} from '../../armelbot/armelbot.client';
import {
  forgetSignIn,
  GoogleCredential,
  renderSignInButton,
  SignInButtonTheme,
} from '../../armelbot/google-identity';
import { ArmelBotSectionContent, SupportedLocale } from '../../models/content.models';
/* Type-only: `app.ts` imports this component, so a value import here would
   close the cycle. */
import type { Theme } from '../../app';

/** Past this the field scrolls instead of growing. */
const FIELD_MAX_HEIGHT = 320;

type ConsoleErrorKind = ArmelBotErrorKind | 'expired';

@Component({
  selector: 'app-armelbot-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './armelbot-section.component.html',
  styleUrl: './armelbot-section.component.css',
})
export class ArmelBotSectionComponent {
  readonly content = input.required<ArmelBotSectionContent>();

  /** Google draws its own button, and it has to be drawn in the page's language. */
  readonly locale = input.required<SupportedLocale>();

  /**
   * The skin on screen. Only the sign-in button reads it, and only to pick
   * which of Google's two liveries to ask for — day gets the white one. The
   * rest of this component follows the skin through CSS like everything else.
   */
  readonly skin = input.required<Theme>();

  private readonly buttonTheme = computed<SignInButtonTheme>(() =>
    this.skin() === 'day' ? 'outline' : 'filled_black',
  );

  protected readonly credential = signal<GoogleCredential | null>(null);
  protected readonly signInFailed = signal(false);
  protected readonly question = signal('');
  protected readonly answer = signal('');
  protected readonly pending = signal(false);

  private readonly error = signal<ConsoleErrorKind | null>(null);

  protected readonly errorMessage = computed(() => {
    const kind = this.error();
    return kind === null ? null : this.content().errors[kind];
  });

  private readonly signInButton = viewChild<ElementRef<HTMLElement>>('signInButton');
  private readonly field = viewChild<ElementRef<HTMLTextAreaElement>>('field');

  /* Nothing here may run while the page is being prerendered: the Google script
     is a browser-only global and the server render has no place to put it. */
  private readonly browserReady = signal(false);

  private renderedInto: HTMLElement | null = null;
  private renderedLocale: SupportedLocale | null = null;
  private renderedTheme: SignInButtonTheme | null = null;

  /** Sent back with every question, so follow-ups keep their context. */
  private exchanges: Exchange[] = [];

  constructor() {
    afterNextRender(() => this.browserReady.set(true));

    /* The host element is destroyed on sign-out and recreated on the next
       sign-in, so the button is re-rendered whenever the element, the language
       or the livery it is drawn in changes — and only then. Google owns the
       drawing, so switching skins means asking it to draw the thing again. */
    effect(() => {
      const host = this.signInButton()?.nativeElement ?? null;
      const locale = this.locale();
      const theme = this.buttonTheme();

      if (!this.browserReady() || host === null) {
        return;
      }
      if (
        host === this.renderedInto &&
        locale === this.renderedLocale &&
        theme === this.renderedTheme
      ) {
        return;
      }

      this.renderedInto = host;
      this.renderedLocale = locale;
      this.renderedTheme = theme;

      renderSignInButton(host, locale, theme, (credential) => this.onCredential(credential)).catch(
        () => {
          this.renderedInto = null;
          this.signInFailed.set(true);
        },
      );
    });
  }

  protected onQuestionInput(event: Event): void {
    const field = event.target as HTMLTextAreaElement;
    this.question.set(field.value);
    this.grow(field);
  }

  protected onEnter(event: Event): void {
    event.preventDefault();
    this.submit();
  }

  protected signOut(): void {
    this.endSession();
    this.error.set(null);
  }

  protected async submit(): Promise<void> {
    const question = this.question().trim();
    const credential = this.credential();

    if (question === '' || credential === null || this.pending()) {
      return;
    }

    if (credential.expiresAt <= Date.now()) {
      this.endSession();
      this.error.set('expired');
      return;
    }

    this.pending.set(true);
    this.error.set(null);

    const sent: Exchange[] = [
      ...this.exchanges.slice(-(MAX_EXCHANGES - 1)),
      { question, answer: null },
    ];

    try {
      const answer = await askArmelBot(sent, credential.token);
      sent[sent.length - 1] = { question, answer };
      this.exchanges = sent;
      this.answer.set(answer);
      this.question.set('');
      this.resetFieldHeight();
    } catch (cause) {
      const kind = cause instanceof ArmelBotError ? cause.kind : 'server';
      /* A rejected token is a dead session: drop it so the button comes back,
         but keep the message on screen to say why. */
      if (kind === 'unauthorized') {
        this.endSession();
      }
      this.error.set(kind);
    } finally {
      this.pending.set(false);
    }
  }

  private onCredential(credential: GoogleCredential): void {
    this.signInFailed.set(false);
    this.error.set(null);
    this.renderedInto = null;
    this.credential.set(credential);
  }

  private endSession(): void {
    forgetSignIn();
    this.credential.set(null);
    this.question.set('');
    this.answer.set('');
    this.exchanges = [];
  }

  private grow(field: HTMLTextAreaElement): void {
    field.style.height = 'auto';
    field.style.height = `${Math.min(field.scrollHeight, FIELD_MAX_HEIGHT)}px`;
  }

  /* Emptying the field programmatically fires no input event, so the inline
     height set by `grow` has to be released by hand or the box stays stretched. */
  private resetFieldHeight(): void {
    const field = this.field()?.nativeElement;
    if (field !== undefined) {
      field.style.height = '';
    }
  }
}
