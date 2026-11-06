import { describe, expect, it } from 'vitest';

import { minVacancyTextLength, parseVacancyInput } from './vacancy-input';

const vacancyText = 'Ищем frontend-разработчика. '.repeat(10);

describe('parseVacancyInput()', () => {
  describe('critical user paths', () => {
    it('принимает ссылку на вакансию', () => {
      expect(parseVacancyInput('https://hh.ru/vacancy/123')).toStrictEqual({
        ok: true,
        value: { kind: 'url', url: 'https://hh.ru/vacancy/123' },
      });
    });

    it('принимает текст вакансии целиком', () => {
      expect(parseVacancyInput(vacancyText)).toStrictEqual({
        ok: true,
        value: { kind: 'text', text: vacancyText.trim() },
      });
    });
  });

  describe('error handling', () => {
    it.each(['', '   ', '\n\t'])('считает пустым ввод %j', (raw) => {
      expect(parseVacancyInput(raw)).toStrictEqual({ ok: false, error: 'empty' });
    });

    it('не принимает слишком короткий текст', () => {
      expect(parseVacancyInput('Frontend-разработчик')).toStrictEqual({
        ok: false,
        error: 'too-short',
      });
    });

    it.each(['ftp://hh.ru/vacancy/1', 'file:///etc/passwd', 'https://'])(
      'не принимает ссылку %s',
      (raw) => {
        expect(parseVacancyInput(raw)).toStrictEqual({ ok: false, error: 'unsupported-url' });
      },
    );
  });

  describe('edge cases', () => {
    it('дописывает https к ссылке без протокола', () => {
      expect(parseVacancyInput('hh.ru/vacancy/123')).toStrictEqual({
        ok: true,
        value: { kind: 'url', url: 'https://hh.ru/vacancy/123' },
      });
    });

    it('убирает пробелы вокруг ссылки', () => {
      expect(parseVacancyInput('  https://hh.ru/vacancy/123\n')).toMatchObject({ ok: true });
    });

    it('принимает текст ровно минимальной длины', () => {
      expect(parseVacancyInput('а'.repeat(minVacancyTextLength))).toMatchObject({ ok: true });
    });

    it('не путает текст с точками и ссылкой', () => {
      expect(parseVacancyInput('Опыт с React.js и Node.js')).toStrictEqual({
        ok: false,
        error: 'too-short',
      });
    });
  });
});
