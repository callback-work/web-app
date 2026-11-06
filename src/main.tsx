import '@fontsource-variable/montserrat';
import '@vega-ui/theme-core';
import '@vega-ui/react/style.css';
import './app/theme.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { createServices } from './app/composition';
import { applyDocumentLocale } from './app/document-locale';
import { LocaleProvider } from './app/LocaleProvider';
import { createStorageLocaleStore } from './app/storage-locale-store';
import { matchLocale } from './shared/i18n';
import { createAppRouter } from './app/router';
import { syncColorScheme } from './app/color-scheme';

const root = document.querySelector('#root');

if (root === null) {
  throw new Error('Не найден элемент #root');
}

syncColorScheme();

const localeStore = createStorageLocaleStore(window.localStorage);
const initialLocale = localeStore.read() ?? matchLocale(navigator.languages);
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
applyDocumentLocale(initialLocale);

const queryClient = new QueryClient();
const router = createAppRouter(createServices());

createRoot(root).render(
  <StrictMode>
    <LocaleProvider store={localeStore} initialLocale={initialLocale} timeZone={timeZone}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </LocaleProvider>
  </StrictMode>,
);
