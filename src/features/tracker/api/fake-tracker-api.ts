import type { Application, TrackerApi } from './tracker-api';

export class FakeTrackerApi implements TrackerApi {
  private readonly applications: Application[];
  private failure: Error | undefined;

  constructor(applications: Application[] = []) {
    this.applications = applications;
  }

  failNextWith(error: Error): void {
    this.failure = error;
  }

  async listApplications(): Promise<Application[]> {
    await Promise.resolve();
    const { failure } = this;
    this.failure = undefined;

    if (failure !== undefined) {
      throw failure;
    }

    return [...this.applications];
  }
}
