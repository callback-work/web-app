import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { IntlProvider } from 'use-intl';
import type { Messages } from 'use-intl';
import { render } from 'vitest-browser-react';

import type { Locale } from '../i18n';

type PartialMessages = Partial<Messages>;

export interface RenderOptions {
  messages: PartialMessages;
  locale?: Locale;
}

export async function renderWithProviders(
  ui: ReactNode,
  { messages, locale = 'ru' }: RenderOptions,
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <IntlProvider
      locale={locale}
      messages={messages}
      timeZone='Europe/Moscow'
      onError={(error) => {
        throw error;
      }}
    >
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </IntlProvider>,
  );
}
