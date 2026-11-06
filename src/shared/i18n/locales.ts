export const locales = ['ru', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ru';

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function matchLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const [base = ''] = language.toLowerCase().split('-');

    if (isLocale(base)) {
      return base;
    }
  }

  return defaultLocale;
}
