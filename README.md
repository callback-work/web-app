# Callback Web

Веб-приложение Callback, где пользователь управляет адаптацией резюме, откликами и почтой. Сейчас готов стартовый экран. API пока нет, поэтому приложение работает на фейковых адаптерах.

## Запуск

```sh
npm ci
npx playwright install chromium firefox webkit
npm run dev
```

## Команды

| Команда                | Что делает                                                                  |
| ---------------------- | --------------------------------------------------------------------------- |
| `npm run check`        | формат, линт, типы, архитектура, все тесты                                  |
| `npm run lint`         | oxlint с конфигом [config-oxc](https://github.com/callback-work/config-oxc) |
| `npm run format`       | oxfmt                                                                       |
| `npm run arch:check`   | правила зависимостей dependency-cruiser                                     |
| `npm run test:unit`    | чистая логика из `model/`, Node                                             |
| `npm run test:browser` | компоненты в Chromium, Firefox и WebKit                                     |
| `npm run test:e2e`     | Playwright по собранному приложению, плюс проверка axe                      |

## Структура

```
src/
  app/        точка входа, роутер, composition.ts
  pages/      страницы, только собирают фичи
  features/   adaptation, tracker, mail-connect
    <фича>/
      api/    порт и fake-адаптер
      model/  чистая логика
      ui/     компоненты
      index.ts    публичный вход
      testing.ts  фейки для тестов и composition.ts
  shared/     общие типы и утилиты
e2e/          сценарии Playwright (*.e2e.ts)
```

Адаптеры выбираются в `src/app/composition.ts`. Компоненты получают порт через пропсы, поэтому в тестах подставляется фейк без моков сети.

Правила в `.dependency-cruiser.json`: фичи не импортируют друг друга, в фичу входим только через `index.ts`, фейки подключают только `composition.ts` и тесты, `model/` не знает про React и API.

## Локализация

Языки: русский (основной) и английский. Библиотека [use-intl](https://www.npmjs.com/package/use-intl), это ядро next-intl без Next.js.

- Каталоги лежат рядом с кодом: `features/<фича>/i18n/{ru,en}.ts`, у страниц и `app` так же. В `src/app/messages.ts` они собираются в одно дерево, у каждой фичи свой namespace: `useTranslations('tracker')`.
- `ru.ts` это источник ключей (`as const`). `en.ts` описывается через `defineCatalog<typeof ru>`, поэтому пропущенный или лишний ключ роняет `tsc`. Типы ключей и аргументов ICU для `t()` берутся из русского каталога (`src/app/intl.d.ts`).
- Тест `src/app/messages.test.ts` проверяет, что в обоих языках одинаковые ключи и аргументы ICU и нет пустых строк.
- Язык при первом входе берётся из `navigator.languages`, иначе русский. Выбор хранится через порт `LocaleStore`, сейчас это localStorage.
- `model/` возвращает коды ошибок и статусов, текст выбирает UI.
- `react/jsx-no-literals` запрещает текст в JSX мимо каталога. Строковые пропсы (`aria-label`, `placeholder`) правило не проверяет, их берём из каталога вручную.

## Тесты

Внутри файлов верхний уровень `describe` один и тот же: `critical user paths`, `error handling`, `edge cases`, `accessibility`.
