import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { renderWithProviders } from '../../../shared/testing/render-with-providers';
import { ru } from '../i18n/ru';
import { FakeAdaptationApi } from '../api/fake-adaptation-api';
import { VacancyForm } from './VacancyForm';

const vacancyText = 'Ищем frontend-разработчика с опытом React от года. '.repeat(5);

async function setup() {
  const api = new FakeAdaptationApi();
  const onSubmitted = vi.fn<(vacancy: { id: string }) => void>();
  const screen = await renderWithProviders(<VacancyForm api={api} onSubmitted={onSubmitted} />, {
    messages: { adaptation: ru },
  });

  return {
    api,
    onSubmitted,
    field: screen.getByRole('textbox', { name: 'Вакансия' }),
    submit: screen.getByRole('button', { name: 'Разобрать вакансию' }),
    screen,
  };
}

describe('<VacancyForm />', () => {
  describe('critical user paths', () => {
    it('отправляет ссылку на вакансию', async () => {
      const { api, onSubmitted, field, submit } = await setup();

      await field.fill('https://hh.ru/vacancy/123');
      await submit.click();

      await expect.poll(() => onSubmitted.mock.calls).toStrictEqual([[{ id: 'vacancy-1' }]]);
      expect(api.submitted).toStrictEqual([{ kind: 'url', url: 'https://hh.ru/vacancy/123' }]);
    });

    it('отправляет текст вакансии', async () => {
      const { api, field, submit } = await setup();

      await field.fill(vacancyText);
      await submit.click();

      await expect
        .poll(() => api.submitted)
        .toStrictEqual([{ kind: 'text', text: vacancyText.trim() }]);
    });

    it('отправляет форму с клавиатуры', async () => {
      const { api, field, submit } = await setup();

      await field.fill('https://hh.ru/vacancy/123');
      submit.element().focus();
      await userEvent.keyboard('{Enter}');

      await expect.poll(() => api.submitted).toHaveLength(1);
    });
  });

  describe('error handling', () => {
    it('не отправляет пустую форму и объясняет почему', async () => {
      const { api, field, submit, screen } = await setup();

      await submit.click();

      await expect
        .element(screen.getByRole('alert'))
        .toHaveTextContent('Вставьте ссылку на вакансию или её текст');
      await expect.element(field).toHaveAttribute('aria-invalid', 'true');
      expect(api.submitted).toStrictEqual([]);
    });

    it('переводит фокус на поле с ошибкой', async () => {
      const { field, submit } = await setup();

      await submit.click();

      await expect.element(field).toHaveFocus();
    });

    it('просит вставить вакансию целиком, если текста мало', async () => {
      const { field, submit, screen } = await setup();

      await field.fill('React');
      await submit.click();

      await expect
        .element(screen.getByRole('alert'))
        .toHaveTextContent('Текста мало для разбора. Вставьте описание вакансии целиком');
    });

    it('показывает ошибку отправки и даёт повторить', async () => {
      const { api, onSubmitted, field, submit, screen } = await setup();
      api.failNextWith(new Error('network'));

      await field.fill('https://hh.ru/vacancy/123');
      await submit.click();
      await expect
        .element(screen.getByRole('alert'))
        .toHaveTextContent('Не получилось отправить вакансию. Попробуйте ещё раз');

      await submit.click();
      await expect.poll(() => onSubmitted.mock.calls).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('убирает ошибку, когда пользователь начинает исправлять ввод', async () => {
      const { field, submit, screen } = await setup();

      await submit.click();
      await expect.element(screen.getByRole('alert')).toBeInTheDocument();

      await field.fill('h');
      await expect.element(screen.getByRole('alert')).not.toBeInTheDocument();
      await expect.element(field).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('accessibility', () => {
    it('связывает подсказку с полем', async () => {
      const { field } = await setup();

      await expect
        .element(field)
        .toHaveAccessibleDescription('Ссылка на вакансию или её текст целиком');
    });

    it('связывает ошибку с полем', async () => {
      const { field, submit } = await setup();

      await submit.click();

      await expect
        .element(field)
        .toHaveAccessibleDescription('Вставьте ссылку на вакансию или её текст');
    });
  });
});
