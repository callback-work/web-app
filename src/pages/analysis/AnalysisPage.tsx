import { Heading, Text } from '@vega-ui/react';
import { useTranslations } from 'use-intl';

import { AppLink } from '../../shared/ui/AppLink';
import styles from './AnalysisPage.module.css';

export function AnalysisPage() {
  const t = useTranslations('analysisPage');

  return (
    <section className={styles.page} aria-labelledby='analysis-title'>
      <Heading as='h1' size={7} fontWeight={700} id='analysis-title'>
        {t('title')}
      </Heading>
      <Text className={styles.muted}>{t('description')}</Text>
      <AppLink to='/'>{t('back')}</AppLink>
    </section>
  );
}
