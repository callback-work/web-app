import { Link as RouterLink } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useTranslations } from 'use-intl';

import styles from './AppLayout.module.css';
import { LocaleSwitch } from './LocaleSwitch';

export function AppLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('app');

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <RouterLink to='/' className={styles.logo}>
          <span className={styles.mark} aria-hidden='true' />
          {t('brand')}
        </RouterLink>
        <LocaleSwitch />
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
