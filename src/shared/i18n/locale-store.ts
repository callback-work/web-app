import type { Locale } from './locales';

export interface LocaleStore {
  read: () => Locale | undefined;
  write: (locale: Locale) => void;
}
