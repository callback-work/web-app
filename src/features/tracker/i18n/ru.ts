export const ru = {
  title: 'Отклики',
  loading: 'Загружаем отклики',
  loadError: 'Не получилось загрузить отклики',
  retry: 'Повторить',
  emptyTitle: 'Откликов пока нет',
  emptyDescription: 'Когда отправите первый, он появится здесь.',
  emptyAction: 'Разобрать первую вакансию',
  total:
    '{count, plural, one {Всего # отклик} few {Всего # отклика} many {Всего # откликов} other {Всего # отклика}}',
  stageValue:
    '{count, plural, one {# отклик} few {# отклика} many {# откликов} other {# отклика}}, {share}',
  stages: {
    waiting: 'Ждут ответа',
    'in-progress': 'В процессе',
    offer: 'Офферы',
    rejected: 'Отказы',
  },
} as const;
