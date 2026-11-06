import {
  Button,
  Card,
  Heading,
  MeterStack,
  MeterStackSegment,
  Spinner,
  Text,
} from '@vega-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useId } from 'react';
import { useFormatter, useTranslations } from 'use-intl';

import type { TrackerApi } from '../api/tracker-api';
import { applicationStages, summarizeApplications } from '../model/summarize-applications';
import type { ApplicationsSummary as Summary } from '../model/summarize-applications';
import styles from './ApplicationsSummary.module.css';

export interface ApplicationsSummaryProps {
  api: TrackerApi;
  onCreateFirst: () => void;
}

function StageBreakdown({ summary }: { summary: Summary }) {
  const t = useTranslations('tracker');
  const format = useFormatter();

  const share = (count: number) =>
    format.number(count / summary.total, { style: 'percent', maximumFractionDigits: 0 });

  return (
    <>
      <MeterStack value={summary.total} max={summary.total} size='lg' fullWidth>
        {applicationStages.map((stage) => (
          <MeterStackSegment
            key={stage}
            value={summary.byStage[stage]}
            aria-label={t(`stages.${stage}`)}
            aria-valuetext={t('stageValue', {
              count: summary.byStage[stage],
              share: share(summary.byStage[stage]),
            })}
            data-stage={stage}
            className={styles.stageColor}
          />
        ))}
      </MeterStack>
      <dl className={styles.legend}>
        {applicationStages.map((stage) => (
          <div key={stage} className={styles.stage}>
            <dt className={styles.stageLabel}>
              <span
                className={`${styles.swatch} ${styles.stageColor}`}
                data-stage={stage}
                aria-hidden='true'
              />
              <Text size={2}>{t(`stages.${stage}`)}</Text>
            </dt>
            <dd className={styles.stageCount}>
              <Text size={2} fontWeight={600}>
                {summary.byStage[stage]}
              </Text>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function SummaryBody({ api, onCreateFirst }: ApplicationsSummaryProps) {
  const t = useTranslations('tracker');

  const applications = useQuery({
    queryKey: ['tracker', 'applications'],
    queryFn: async () => api.listApplications(),
  });

  if (applications.isPending) {
    return (
      <div className={styles.state}>
        <Spinner size={2} aria-label={t('loading')} />
      </div>
    );
  }

  if (applications.isError) {
    return (
      <div className={styles.state} role='alert'>
        <Text size={2}>{t('loadError')}</Text>
        <Button
          type='button'
          size='xs'
          variant='secondary'
          appearance='ghost'
          onClick={() => {
            void applications.refetch();
          }}
        >
          {t('retry')}
        </Button>
      </div>
    );
  }

  const summary = summarizeApplications(applications.data);

  if (summary.total === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyText}>
          <Text size={3} fontWeight={700}>
            {t('emptyTitle')}
          </Text>
          <Text size={2} className={styles.muted}>
            {t('emptyDescription')}
          </Text>
        </div>
        <Button
          type='button'
          size='xs'
          variant='secondary'
          appearance='ghost'
          onClick={onCreateFirst}
        >
          {t('emptyAction')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Text size={2} className={styles.muted}>
        {t('total', { count: summary.total })}
      </Text>
      <StageBreakdown summary={summary} />
    </>
  );
}

export function ApplicationsSummary({ api, onCreateFirst }: ApplicationsSummaryProps) {
  const t = useTranslations('tracker');
  const titleId = useId();

  return (
    <Card className={styles.card} aria-labelledby={titleId}>
      <Heading as='h2' size={4} fontWeight={600} id={titleId}>
        {t('title')}
      </Heading>
      <SummaryBody api={api} onCreateFirst={onCreateFirst} />
    </Card>
  );
}
