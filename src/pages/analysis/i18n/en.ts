import { defineCatalog } from '../../../shared/i18n';
import type { ru } from './ru';

export const en = defineCatalog<typeof ru>({
  title: 'Job posting received',
  description:
    'The breakdown will appear here: matches, gaps and a score from 0 to 100. This screen comes next.',
  back: 'Back to home',
});
