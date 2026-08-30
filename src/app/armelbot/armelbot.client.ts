import { API_BASE_URL } from './armelbot.config';

/** Mirrors `ChatPayload.Exchange` on the backend. */
export interface Exchange {
  question: string;
  answer: string | null;
}

interface ChatPayload {
  exchanges: Exchange[];
}

/** `@Size(max = 20)` on the backend's `exchanges` list. */
export const MAX_EXCHANGES = 20;

export type ArmelBotErrorKind = 'unauthorized' | 'forbidden' | 'quota' | 'server' | 'network';

/** What the backend answers with when it refuses; anything else is `server`. */
const ERROR_BY_STATUS: Record<number, ArmelBotErrorKind> = {
  401: 'unauthorized',
  403: 'forbidden',
  429: 'quota',
};

export class ArmelBotError extends Error {
  constructor(readonly kind: ArmelBotErrorKind) {
    super(kind);
    this.name = 'ArmelBotError';
  }
}

export async function askArmelBot(exchanges: Exchange[], idToken: string): Promise<string> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/armelbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ exchanges } satisfies ChatPayload),
    });
  } catch {
    throw new ArmelBotError('network');
  }

  if (!response.ok) {
    throw new ArmelBotError(ERROR_BY_STATUS[response.status] ?? 'server');
  }

  let answer: string | null | undefined;

  try {
    const payload = (await response.json()) as ChatPayload;
    answer = payload.exchanges.at(-1)?.answer;
  } catch {
    throw new ArmelBotError('server');
  }

  if (answer === null || answer === undefined || answer.trim() === '') {
    throw new ArmelBotError('server');
  }

  return answer;
}
