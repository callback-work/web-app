import { defineCatalog } from '../../shared/i18n';
import type { ru } from './ru';

export const en = defineCatalog<typeof ru>({
  brand: 'Callback',
  otherLocale: 'Русский',
});
