import { isLocale } from '../shared/i18n';
import type { LocaleStore } from '../shared/i18n';

const key = 'callback.locale';

function readItem(storage: Storage): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function createStorageLocaleStore(storage: Storage): LocaleStore {
  return {
    read: () => {
      const value = readItem(storage);
      return value !== null && isLocale(value) ? value : undefined;
    },
    write: (locale) => {
      try {
        storage.setItem(key, locale);
      } catch {
        // Без хранилища язык не запомнится, но интерфейс всё равно переключится.
      }
    },
  };
}
