import type { ApplicationStatus } from '../../../shared/application-status';

export type ApplicationStage = 'waiting' | 'in-progress' | 'offer' | 'rejected';

export const applicationStages: readonly ApplicationStage[] = [
  'waiting',
  'in-progress',
  'offer',
  'rejected',
];

const stageByStatus: Record<ApplicationStatus, ApplicationStage> = {
  sent: 'waiting',
  viewed: 'waiting',
  test_task: 'in-progress',
  invited: 'in-progress',
  interview: 'in-progress',
  offer: 'offer',
  rejected: 'rejected',
};

interface WithStatus {
  status: ApplicationStatus;
}

export interface ApplicationsSummary {
  total: number;
  byStage: Record<ApplicationStage, number>;
}

export function summarizeApplications(applications: readonly WithStatus[]): ApplicationsSummary {
  const byStage: Record<ApplicationStage, number> = {
    waiting: 0,
    'in-progress': 0,
    offer: 0,
    rejected: 0,
  };

  for (const { status } of applications) {
    byStage[stageByStatus[status]] += 1;
  }

  return { total: applications.length, byStage };
}
