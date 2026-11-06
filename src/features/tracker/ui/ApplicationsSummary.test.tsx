import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../shared/testing/render-with-providers';
import { FakeTrackerApi } from '../api/fake-tracker-api';
import type { Application } from '../api/tracker-api';
import { ru } from '../i18n/ru';
import { ApplicationsSummary } from './ApplicationsSummary';

const applications: Application[] = [
  { id: '1', company: 'Альфа', position: 'Frontend', status: 'sent' },
  { id: '2', company: 'Бета', position: 'Frontend', status: 'interview' },
  { id: '3', company: 'Гамма', position: 'Fullstack', status: 'rejected' },
];

async function setup(api = new FakeTrackerApi(applications)) {
  const onCreateFirst = vi.fn<() => void>();
  const screen = await renderWithProviders(
    <ApplicationsSummary api={api} onCreateFirst={onCreateFirst} />,
    { messages: { tracker: ru } },
  );

  return { screen, onCreateFirst };
}

describe('<ApplicationsSummary />', () => {
  describe('critical user paths', () => {
    it('показывает общее число откликов и разбивку по этапам', async () => {
      const { screen } = await setup();

      await expect.element(screen.getByText('Всего 3 отклика')).toBeVisible();
      const counts = screen
        .getByRole('definition')
        .elements()
        .map((node) => node.textContent);
      expect(counts).toStrictEqual(['1', '1', '0', '1']);
    });

    it('предлагает разобрать первую вакансию, когда откликов нет', async () => {
      const { screen, onCreateFirst } = await setup(new FakeTrackerApi());

      await expect.element(screen.getByText('Откликов пока нет')).toBeVisible();
      await screen.getByRole('button', { name: 'Разобрать первую вакансию' }).click();

      expect(onCreateFirst).toHaveBeenCalledOnce();
    });
  });

  describe('error handling', () => {
    it('сообщает об ошибке загрузки и загружает повторно', async () => {
      const api = new FakeTrackerApi(applications);
      api.failNextWith(new Error('network'));
      const { screen } = await setup(api);

      await expect
        .element(screen.getByRole('alert').getByText('Не получилось загрузить отклики'))
        .toBeVisible();
      await screen.getByRole('button', { name: 'Повторить' }).click();

      await expect.element(screen.getByText('Всего 3 отклика')).toBeVisible();
    });
  });

  describe('accessibility', () => {
    it('называет карточку её заголовком', async () => {
      const { screen } = await setup(new FakeTrackerApi());

      await expect.element(screen.getByRole('article', { name: 'Отклики' })).toBeVisible();
    });

    it('озвучивает каждый этап полосы числом и долей', async () => {
      const { screen } = await setup();

      await expect
        .element(screen.getByRole('meter', { name: 'Ждут ответа' }))
        .toHaveAttribute('aria-valuetext', expect.stringMatching(/^1 отклик, 33\s%$/));
      await expect
        .element(screen.getByRole('meter', { name: 'Офферы' }))
        .toHaveAttribute('aria-valuetext', expect.stringMatching(/^0 откликов, 0\s%$/));
    });
  });
});
