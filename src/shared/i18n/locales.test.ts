import { describe, expect, it } from 'vitest';

import { matchLocale } from './locales';

describe('matchLocale()', () => {
  describe('critical user paths', () => {
    it.each([
      [['ru-RU'], 'ru'],
      [['en-US'], 'en'],
      [['de-DE', 'en-GB', 'ru'], 'en'],
    ])('выбирает первый поддерживаемый язык из %j', (languages, expected) => {
      expect(matchLocale(languages)).toBe(expected);
    });
  });

  describe('edge cases', () => {
    it('возвращает русский, если поддерживаемых языков нет', () => {
      expect(matchLocale(['de-DE', 'fr'])).toBe('ru');
    });

    it('возвращает русский, если браузер не сообщил языки', () => {
      expect(matchLocale([])).toBe('ru');
    });

    it('не зависит от регистра', () => {
      expect(matchLocale(['EN-us'])).toBe('en');
    });
  });
});
