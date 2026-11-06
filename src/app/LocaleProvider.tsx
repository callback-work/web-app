import { useState } from 'react';
import type { ReactNode } from 'react';
import { IntlProvider } from 'use-intl';

import type { Locale, LocaleStore } from '../shared/i18n';
import { applyDocumentLocale } from './document-locale';
import { ChangeLocaleContext } from './locale-context';
import { messages } from './messages';

export interface LocaleProviderProps {
  store: LocaleStore;
  initialLocale: Locale;
  timeZone: string;
  children: ReactNode;
}

export function LocaleProvider({ store, initialLocale, timeZone, children }: LocaleProviderProps) {
  const [locale, setLocale] = useState(initialLocale);

  const changeLocale = (next: Locale) => {
    store.write(next);
    applyDocumentLocale(next);
    setLocale(next);
  };

  return (
    <ChangeLocaleContext value={changeLocale}>
      <IntlProvider locale={locale} messages={messages[locale]} timeZone={timeZone}>
        {children}
      </IntlProvider>
    </ChangeLocaleContext>
  );
}
