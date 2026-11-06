import { createContext, useContext } from 'react';

import type { Locale } from '../shared/i18n';

export const ChangeLocaleContext = createContext<((locale: Locale) => void) | undefined>(undefined);

export function useChangeLocale() {
  const changeLocale = useContext(ChangeLocaleContext);

  if (changeLocale === undefined) {
    throw new Error('useChangeLocale вызван вне LocaleProvider');
  }

  return changeLocale;
}
