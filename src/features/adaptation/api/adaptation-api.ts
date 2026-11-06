import type { VacancyInput } from '../model/vacancy-input';

export interface SubmittedVacancy {
  id: string;
}

export interface AdaptationApi {
  submitVacancy: (input: VacancyInput) => Promise<SubmittedVacancy>;
}
