import type { Locale } from '../shared/i18n';

export function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale;
}
