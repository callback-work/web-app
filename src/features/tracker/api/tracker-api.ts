import type { ApplicationStatus } from '../../../shared/application-status';

export interface Application {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
}

export interface TrackerApi {
  listApplications: () => Promise<Application[]>;
}
