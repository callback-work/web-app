import { createTranslator } from 'use-intl';
import { describe, expect, it } from 'vitest';

import { en } from './en';
import { ru } from './ru';

describe('склонение числа откликов', () => {
  describe('critical user paths', () => {
    it.each([
      [1, 'Всего 1 отклик'],
      [2, 'Всего 2 отклика'],
      [5, 'Всего 5 откликов'],
      [11, 'Всего 11 откликов'],
      [12, 'Всего 12 откликов'],
      [21, 'Всего 21 отклик'],
      [22, 'Всего 22 отклика'],
      [25, 'Всего 25 откликов'],
      [111, 'Всего 111 откликов'],
    ])('по-русски: %i', (count, expected) => {
      const t = createTranslator({ locale: 'ru', messages: { tracker: ru }, namespace: 'tracker' });

      expect(t('total', { count })).toBe(expected);
    });

    it.each([
      [1, '1 application in total'],
      [2, '2 applications in total'],
    ])('по-английски: %i', (count, expected) => {
      const t = createTranslator({ locale: 'en', messages: { tracker: en }, namespace: 'tracker' });

      expect(t('total', { count })).toBe(expected);
    });
  });
});
