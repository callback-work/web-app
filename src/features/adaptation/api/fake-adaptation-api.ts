import type { VacancyInput } from '../model/vacancy-input';
import type { AdaptationApi, SubmittedVacancy } from './adaptation-api';

export class FakeAdaptationApi implements AdaptationApi {
  readonly submitted: VacancyInput[] = [];
  private failure: Error | undefined;

  failNextWith(error: Error): void {
    this.failure = error;
  }

  async submitVacancy(input: VacancyInput): Promise<SubmittedVacancy> {
    await Promise.resolve();
    const { failure } = this;
    this.failure = undefined;

    if (failure !== undefined) {
      throw failure;
    }

    this.submitted.push(input);
    return { id: `vacancy-${this.submitted.length}` };
  }
}
