import { GOOGLE_CLIENT_ID } from './armelbot.config';

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

interface CredentialResponse {
  credential?: string;
}

interface GoogleIdApi {
  initialize(config: {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    auto_select?: boolean;
  }): void;
  renderButton(parent: HTMLElement, options: Record<string, string>): void;
  disableAutoSelect(): void;
}

interface TokenPayload {
  name?: string;
  email?: string;
  exp?: number;
}

export interface GoogleCredential {
  token: string;
  name: string;
  email: string;
  expiresAt: number;
}

let loading: Promise<GoogleIdApi> | null = null;

function identityApi(): GoogleIdApi | null {
  const google = (globalThis as { google?: { accounts?: { id?: GoogleIdApi } } }).google;
  return google?.accounts?.id ?? null;
}

/**
 * Loads Google's client once, in `locale`.
 *
 * The language is fixed by `hl` on the script URL: `renderButton`'s own
 * `locale` option is read before the client has booted and does nothing
 * afterwards, and the client cannot be reloaded in another language. So the
 * button speaks whichever locale the page was opened in — which is the locale
 * the URL names, each one being prerendered separately — and a reader who
 * switches language in place keeps the button they arrived with.
 */
function loadIdentityApi(locale: string): Promise<GoogleIdApi> {
  const ready = identityApi();
  if (ready !== null) {
    return Promise.resolve(ready);
  }

  if (loading === null) {
    const pending = new Promise<GoogleIdApi>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${SCRIPT_SRC}?hl=${encodeURIComponent(locale)}`;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', () => {
        const loaded = identityApi();
        if (loaded === null) {
          reject(new Error('Google Identity Services loaded without an id API'));
          return;
        }
        resolve(loaded);
      });
      script.addEventListener('error', () =>
        reject(new Error('Google Identity Services failed to load')),
      );
      document.head.appendChild(script);
    });

    /* A failed load must not poison every later attempt: drop the cached
       promise so re-rendering the button retries the script. */
    pending.catch(() => {
      if (loading === pending) {
        loading = null;
      }
    });
    loading = pending;
  }

  return loading;
}

/**
 * The ID token's own claims, read for the display name and the expiry only.
 * The signature is never checked here — the backend is what validates it.
 */
function readCredential(token: string | undefined): GoogleCredential | null {
  const segment = token?.split('.')[1];
  if (token === undefined || segment === undefined) {
    return null;
  }

  try {
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as TokenPayload;

    return {
      token,
      name: payload.name ?? payload.email ?? '',
      email: payload.email ?? '',
      expiresAt: typeof payload.exp === 'number' ? payload.exp * 1000 : 0,
    };
  } catch {
    return null;
  }
}

export function renderSignInButton(
  parent: HTMLElement,
  locale: string,
  onCredential: (credential: GoogleCredential) => void,
): Promise<void> {
  return loadIdentityApi(locale).then((id) => {
    id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        const credential = readCredential(response.credential);
        if (credential !== null) {
          onCredential(credential);
        }
      },
      auto_select: false,
      /* `use_fedcm_for_button: false`, `use_fedcm_for_prompt: false` and
         `itp_support: false` were tried here and measured on production: the
         client still swaps its inline button for the FedCM iframe a moment
         after first paint, so they were removed rather than left in looking
         load-bearing. The white slab that swap produces is dealt with in the
         stylesheet — see the `gsi/button` rule in
         `components/armelbot-section/armelbot-section.component.css`. */
    });

    /* `renderButton` appends rather than replaces, so signing out and back in
       would otherwise leave the previous button in place. */
    parent.replaceChildren();

    /* These options are the only styling that reaches the button once Google
       swaps it into the FedCM iframe — they travel as query parameters on the
       frame's own URL, so Google applies them on its side of a boundary the
       page's CSS cannot cross.

       `outline` is the one livery without a white plate under the four-colour
       mark: the filled themes put the G on a white disc, which Google's own
       brand rules require on a solid fill, and on the night sky that disc
       reads as a white ring stuck inside a dark pill. `outline` makes the
       whole button white instead, so the mark sits flat on it and there is no
       stray white left anywhere. It is therefore the same in all three skins —
       see the stylesheet for why the button does not follow them. */
    id.renderButton(parent, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: 'signin_with',
      logo_alignment: 'left',
      locale,
    });
  });
}

/** Undoes Google's auto sign-in, so signing out here actually sticks. */
export function forgetSignIn(): void {
  identityApi()?.disableAutoSelect();
}
