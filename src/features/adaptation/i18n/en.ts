import { defineCatalog } from '../../../shared/i18n';
import type { ru } from './ru';

export const en = defineCatalog<typeof ru>({
  label: 'Job posting',
  placeholder: 'https://hh.ru/vacancy/… or the job posting text',
  hint: 'A link to the job posting or its full text',
  submit: 'Analyze job posting',
  submitting: 'Sending…',
  submitError: "Couldn't send the job posting. Please try again",
  errors: {
    empty: 'Paste a link to the job posting or its text',
    'too-short': 'Not enough text to analyze. Paste the full job description',
    'unsupported-url': 'The link must start with http:// or https://',
  },
});
