import { adaptationMessages } from '../features/adaptation';
import { mailConnectMessages } from '../features/mail-connect';
import { trackerMessages } from '../features/tracker';
import { analysisPageMessages } from '../pages/analysis/i18n';
import { startPageMessages } from '../pages/start/i18n';
import type { Locale } from '../shared/i18n';
import { en as appEn } from './i18n/en';
import { ru as appRu } from './i18n/ru';

export const ruMessages = {
  app: appRu,
  adaptation: adaptationMessages.ru,
  tracker: trackerMessages.ru,
  mailConnect: mailConnectMessages.ru,
  startPage: startPageMessages.ru,
  analysisPage: analysisPageMessages.ru,
};

const enMessages = {
  app: appEn,
  adaptation: adaptationMessages.en,
  tracker: trackerMessages.en,
  mailConnect: mailConnectMessages.en,
  startPage: startPageMessages.en,
  analysisPage: analysisPageMessages.en,
};

export const messages: Record<Locale, typeof ruMessages> = {
  ru: ruMessages,
  en: enMessages,
};

export const otherLocale: Record<Locale, Locale> = { ru: 'en', en: 'ru' };
