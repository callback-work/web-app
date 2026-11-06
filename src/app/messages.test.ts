import { describe, expect, it } from 'vitest';

import { messages } from './messages';

interface Leaf {
  path: string;
  message: string;
}

function collectLeaves(node: object, prefix = ''): Leaf[] {
  return Object.entries(node).flatMap(([key, value]: [string, unknown]) => {
    const path = prefix === '' ? key : `${prefix}.${key}`;

    if (typeof value === 'string') {
      return [{ path, message: value }];
    }

    return typeof value === 'object' && value !== null ? collectLeaves(value, path) : [];
  });
}

function argumentNames(message: string): string[] {
  const names = [...message.matchAll(/\{\s*([A-Za-z_]\w*)\s*[,}]/g)].map(([, name]) => name ?? '');
  return [...new Set(names)].toSorted();
}

const ruLeaves = collectLeaves(messages.ru);
const enLeaves = collectLeaves(messages.en);
const enByPath = new Map(enLeaves.map((leaf) => [leaf.path, leaf.message]));
const pairs = ruLeaves.map(({ path, message }) => ({
  path,
  ru: message,
  en: enByPath.get(path) ?? '',
}));

describe('каталоги сообщений', () => {
  describe('critical user paths', () => {
    it('в английском каталоге те же ключи, что в русском', () => {
      expect(enLeaves.map(({ path }) => path).toSorted()).toStrictEqual(
        ruLeaves.map(({ path }) => path).toSorted(),
      );
    });

    it.each(pairs)('$path: те же аргументы в обоих языках', ({ ru, en }) => {
      expect(argumentNames(en)).toStrictEqual(argumentNames(ru));
    });
  });

  describe('edge cases', () => {
    it.each(pairs)('$path: нет пустых переводов', ({ ru, en }) => {
      expect([ru.trim(), en.trim()]).not.toContain('');
    });
  });
});
