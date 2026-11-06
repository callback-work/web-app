import type { Locale } from '../shared/i18n';
import type { ruMessages } from './messages';

declare module 'use-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof ruMessages;
  }
}
