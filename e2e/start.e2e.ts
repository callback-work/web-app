import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('стартовый экран', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('critical user paths', () => {
    test('новый пользователь видит, с чего начать', async ({ page }) => {
      await expect(
        page.getByRole('heading', { level: 1, name: 'Подгоним резюме под вакансию' }),
      ).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Вакансия' })).toBeVisible();
      await expect(page.getByText('Откликов пока нет')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Подключить Gmail' })).toBeVisible();
    });

    test('ссылка на вакансию ведёт к разбору', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Вакансия' }).fill('hh.ru/vacancy/123');
      await page.getByRole('button', { name: 'Разобрать вакансию' }).click();

      await expect(page).toHaveURL('/analysis/vacancy-1');
      await expect(page.getByRole('heading', { level: 1, name: 'Вакансия принята' })).toBeVisible();

      await page.getByRole('link', { name: 'На главную' }).click();
      await expect(page).toHaveURL('/');
    });

    test('из пустого трекера можно сразу перейти к вакансии', async ({ page }) => {
      await page.getByRole('button', { name: 'Разобрать первую вакансию' }).click();

      await expect(page.getByRole('textbox', { name: 'Вакансия' })).toBeFocused();
    });

    test('подключение Gmail', async ({ page }) => {
      await page.getByRole('button', { name: 'Подключить Gmail' }).click();

      await expect(page.getByRole('status')).toHaveText('Gmail подключён: you@gmail.com');
    });

    test.describe('язык интерфейса', () => {
      test('по умолчанию русский для русского браузера', async ({ page }) => {
        await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
        await expect(page.getByRole('button', { name: 'English' })).toBeVisible();
      });

      test('выбор языка сохраняется после перезагрузки', async ({ page }) => {
        await page.getByRole('button', { name: 'English' }).click();

        await expect(
          page.getByRole('heading', { level: 1, name: 'Tailor your resume to the job' }),
        ).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');

        await page.reload();

        await expect(
          page.getByRole('heading', { level: 1, name: 'Tailor your resume to the job' }),
        ).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      });

      test.describe('в английском браузере', () => {
        test.use({ locale: 'en-US' });

        test('интерфейс открывается на английском', async ({ page }) => {
          await expect(
            page.getByRole('heading', { level: 1, name: 'Tailor your resume to the job' }),
          ).toBeVisible();
          await expect(page.getByRole('button', { name: 'Analyze job posting' })).toBeVisible();
          await expect(page.getByRole('button', { name: 'Русский' })).toBeVisible();
        });

        test('ошибки формы тоже на английском', async ({ page }) => {
          await page.getByRole('button', { name: 'Analyze job posting' }).click();

          await expect(page.getByRole('alert')).toHaveText(
            'Paste a link to the job posting or its text',
          );
        });
      });
    });
  });

  test.describe('error handling', () => {
    test('пустая форма не отправляется', async ({ page }) => {
      await page.getByRole('button', { name: 'Разобрать вакансию' }).click();

      await expect(page.getByRole('alert')).toHaveText('Вставьте ссылку на вакансию или её текст');
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('edge cases', () => {
    test('страница не скроллится по горизонтали', async ({ page }) => {
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );

      expect(overflow).toBe(0);
    });
  });

  test.describe('accessibility', () => {
    test('нет нарушений WCAG A и AA', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

      expect(results.violations).toStrictEqual([]);
    });

    test.describe('на английском', () => {
      test.use({ locale: 'en-US' });

      test('нет нарушений WCAG A и AA', async ({ page }) => {
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

        expect(results.violations).toStrictEqual([]);
      });
    });

    test.describe('в тёмной теме', () => {
      test.use({ colorScheme: 'dark' });

      test('тема берётся из настройки системы', async ({ page }) => {
        await expect(page.locator('html')).toHaveClass('dark');
      });

      test('нет нарушений WCAG A и AA', async ({ page }) => {
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

        expect(results.violations).toStrictEqual([]);
      });
    });
  });
});
