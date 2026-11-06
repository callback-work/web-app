export const minVacancyTextLength = 200;

export type VacancyInput = { kind: 'url'; url: string } | { kind: 'text'; text: string };

export type VacancyInputError = 'empty' | 'too-short' | 'unsupported-url';

export type VacancyInputResult =
  | { ok: true; value: VacancyInput }
  | { ok: false; error: VacancyInputError };

const webProtocols = new Set(['http:', 'https:']);

function parseUrl(candidate: string): VacancyInputResult {
  const withProtocol = candidate.includes('://') ? candidate : `https://${candidate}`;
  const url = URL.parse(withProtocol);

  if (url === null || !webProtocols.has(url.protocol)) {
    return { ok: false, error: 'unsupported-url' };
  }

  return { ok: true, value: { kind: 'url', url: url.href } };
}

function looksLikeUrl(candidate: string): boolean {
  if (/\s/.test(candidate)) {
    return false;
  }

  return candidate.includes('://') || /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(candidate);
}

export function parseVacancyInput(raw: string): VacancyInputResult {
  const trimmed = raw.trim();

  if (trimmed === '') {
    return { ok: false, error: 'empty' };
  }

  if (looksLikeUrl(trimmed)) {
    return parseUrl(trimmed);
  }

  if (trimmed.length < minVacancyTextLength) {
    return { ok: false, error: 'too-short' };
  }

  return { ok: true, value: { kind: 'text', text: trimmed } };
}
