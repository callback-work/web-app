import { Button } from '@vega-ui/react';
import { useLocale, useTranslations } from 'use-intl';

import { useChangeLocale } from './locale-context';
import { otherLocale } from './messages';

export function LocaleSwitch() {
  const t = useTranslations('app');
  const locale = useLocale();
  const changeLocale = useChangeLocale();
  const next = otherLocale[locale];

  return (
    <Button
      type='button'
      size='xs'
      variant='secondary'
      appearance='ghost'
      lang={next}
      onClick={() => changeLocale(next)}
    >
      {t('otherLocale')}
    </Button>
  );
}
