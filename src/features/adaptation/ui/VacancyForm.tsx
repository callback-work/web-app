import { Button, HelperText, Label, TextArea } from '@vega-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useId, useState } from 'react';
import type { Ref, SubmitEvent } from 'react';
import { useTranslations } from 'use-intl';

import type { AdaptationApi, SubmittedVacancy } from '../api/adaptation-api';
import { parseVacancyInput } from '../model/vacancy-input';
import type { VacancyInput, VacancyInputError } from '../model/vacancy-input';
import styles from './VacancyForm.module.css';

export interface VacancyFormProps {
  api: AdaptationApi;
  onSubmitted: (vacancy: SubmittedVacancy) => void;
  inputRef?: Ref<HTMLTextAreaElement>;
}

export function VacancyForm({ api, onSubmitted, inputRef }: VacancyFormProps) {
  const t = useTranslations('adaptation');
  const id = useId();
  const [inputError, setInputError] = useState<VacancyInputError>();

  const submit = useMutation({
    mutationFn: async (input: VacancyInput) => api.submitVacancy(input),
    onSuccess: (vacancy) => {
      onSubmitted(vacancy);
    },
  });

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = new FormData(form).get('vacancy');
    const result = parseVacancyInput(typeof raw === 'string' ? raw : '');

    if (!result.ok) {
      setInputError(result.error);
      const field = form.elements.namedItem('vacancy');

      if (field instanceof HTMLTextAreaElement) {
        field.focus();
      }

      return;
    }

    submit.mutate(result.value);
  };

  const onChange = () => {
    setInputError(undefined);
    submit.reset();
  };

  const errorMessage = inputError === undefined ? undefined : t(`errors.${inputError}`);
  const message = submit.isError ? t('submitError') : errorMessage;
  const hasError = message !== undefined;

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <Label htmlFor={`${id}-vacancy`}>{t('label')}</Label>
        <TextArea
          ref={inputRef}
          id={`${id}-vacancy`}
          name='vacancy'
          rows={5}
          fullWidth
          placeholder={t('placeholder')}
          error={hasError}
          aria-invalid={hasError}
          aria-describedby={`${id}-hint`}
          onChange={onChange}
        />
        <HelperText
          id={`${id}-hint`}
          error={hasError}
          role={hasError ? 'alert' : undefined}
          className={hasError ? undefined : styles.hint}
        >
          {message ?? t('hint')}
        </HelperText>
      </div>
      <Button type='submit' size='sm' disabled={submit.isPending} className={styles.submit}>
        {submit.isPending ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
