import { Heading, Text } from '@vega-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useRef } from 'react';
import { useTranslations } from 'use-intl';

import { VacancyForm } from '../../features/adaptation';
import type { AdaptationApi, SubmittedVacancy } from '../../features/adaptation';
import { MailConnectCard } from '../../features/mail-connect';
import type { MailApi } from '../../features/mail-connect';
import { ApplicationsSummary } from '../../features/tracker';
import type { TrackerApi } from '../../features/tracker';
import styles from './StartPage.module.css';

export interface StartPageProps {
  adaptationApi: AdaptationApi;
  trackerApi: TrackerApi;
  mailApi: MailApi;
}

export function StartPage({ adaptationApi, trackerApi, mailApi }: StartPageProps) {
  const t = useTranslations('startPage');
  const navigate = useNavigate();
  const vacancyInputRef = useRef<HTMLTextAreaElement>(null);

  const onSubmitted = ({ id }: SubmittedVacancy) => {
    void navigate({ to: '/analysis/$vacancyId', params: { vacancyId: id } });
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby='start-title'>
        <div className={styles.intro}>
          <Heading as='h1' size={7} fontWeight={700} id='start-title' className={styles.title}>
            {t('title')}
          </Heading>
          <Text size={3} className={styles.lead}>
            {t('lead')}
          </Text>
        </div>
        <VacancyForm api={adaptationApi} onSubmitted={onSubmitted} inputRef={vacancyInputRef} />
      </section>
      <div className={styles.cards}>
        <ApplicationsSummary
          api={trackerApi}
          onCreateFirst={() => vacancyInputRef.current?.focus()}
        />
        <MailConnectCard api={mailApi} />
      </div>
    </div>
  );
}
