import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../../shared/testing/render-with-providers';
import { ru } from '../i18n/ru';
import { FakeMailApi } from '../api/fake-mail-api';
import { MailConnectCard } from './MailConnectCard';

describe('<MailConnectCard />', () => {
  describe('critical user paths', () => {
    it('подключает Gmail', async () => {
      const screen = await renderWithProviders(<MailConnectCard api={new FakeMailApi()} />, {
        messages: { mailConnect: ru },
      });

      await screen.getByRole('button', { name: 'Подключить Gmail' }).click();

      await expect
        .element(screen.getByRole('status'))
        .toHaveTextContent('Gmail подключён: you@gmail.com');
      await expect
        .element(screen.getByRole('button', { name: 'Подключить Gmail' }))
        .not.toBeInTheDocument();
    });

    it('показывает уже подключённый ящик', async () => {
      const api = new FakeMailApi({ status: 'connected', address: 'me@gmail.com' });
      const screen = await renderWithProviders(<MailConnectCard api={api} />, {
        messages: { mailConnect: ru },
      });

      await expect
        .element(screen.getByRole('status'))
        .toHaveTextContent('Gmail подключён: me@gmail.com');
    });
  });

  describe('error handling', () => {
    it('сообщает о сбое подключения и оставляет кнопку', async () => {
      const api = new FakeMailApi();
      api.failNextWith(new Error('oauth'));
      const screen = await renderWithProviders(<MailConnectCard api={api} />, {
        messages: { mailConnect: ru },
      });

      await screen.getByRole('button', { name: 'Подключить Gmail' }).click();

      await expect
        .element(screen.getByRole('alert'))
        .toHaveTextContent('Не получилось подключить Gmail. Попробуйте ещё раз');
      await expect.element(screen.getByRole('button', { name: 'Подключить Gmail' })).toBeEnabled();
    });
  });

  describe('accessibility', () => {
    it('называет карточку её заголовком', async () => {
      const screen = await renderWithProviders(<MailConnectCard api={new FakeMailApi()} />, {
        messages: { mailConnect: ru },
      });

      await expect.element(screen.getByRole('article', { name: 'Почта' })).toBeVisible();
    });
  });
});
