import { defineCatalog } from '../../../shared/i18n';
import type { ru } from './ru';

export const en = defineCatalog<typeof ru>({
  title: 'Applications',
  loading: 'Loading applications',
  loadError: "Couldn't load applications",
  retry: 'Retry',
  emptyTitle: 'No applications yet',
  emptyDescription: 'Once you send the first one, it will show up here.',
  emptyAction: 'Analyze your first job posting',
  total: '{count, plural, one {# application in total} other {# applications in total}}',
  stageValue: '{count, plural, one {# application} other {# applications}}, {share}',
  stages: {
    waiting: 'Awaiting reply',
    'in-progress': 'In progress',
    offer: 'Offers',
    rejected: 'Rejections',
  },
});
