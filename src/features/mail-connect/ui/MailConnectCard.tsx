import { Button, Card, Heading, HelperText, Spinner, Text } from '@vega-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useId } from 'react';
import { useTranslations } from 'use-intl';

import type { MailApi } from '../api/mail-api';
import styles from './MailConnectCard.module.css';

const connectionKey = ['mail', 'connection'];

export interface MailConnectCardProps {
  api: MailApi;
}

function CardBody({ api }: MailConnectCardProps) {
  const t = useTranslations('mailConnect');
  const queryClient = useQueryClient();

  const connection = useQuery({
    queryKey: connectionKey,
    queryFn: async () => api.getConnection(),
  });

  const connect = useMutation({
    mutationFn: async () => api.connectGmail(),
    onSuccess: (next) => queryClient.setQueryData(connectionKey, next),
  });

  if (connection.isPending) {
    return <Spinner size={2} aria-label={t('checking')} />;
  }

  if (connection.isError) {
    return <Text role='alert'>{t('checkError')}</Text>;
  }

  if (connection.data.status === 'connected') {
    return (
      <Text size={2} asChild>
        <output>{t('connected', { address: connection.data.address })}</output>
      </Text>
    );
  }

  return (
    <div className={styles.action}>
      <Button
        type='button'
        size='xs'
        variant='secondary'
        appearance='outline'
        disabled={connect.isPending}
        onClick={() => connect.mutate()}
      >
        {connect.isPending ? t('connecting') : t('connect')}
      </Button>
      {connect.isError && (
        <HelperText error role='alert'>
          {t('connectError')}
        </HelperText>
      )}
    </div>
  );
}

export function MailConnectCard({ api }: MailConnectCardProps) {
  const t = useTranslations('mailConnect');
  const titleId = useId();

  return (
    <Card className={styles.card} aria-labelledby={titleId}>
      <div className={styles.header}>
        <Heading as='h2' size={4} fontWeight={600} id={titleId}>
          {t('title')}
        </Heading>
        <Text size={2} className={styles.muted}>
          {t('description')}
        </Text>
      </div>
      <CardBody api={api} />
    </Card>
  );
}
