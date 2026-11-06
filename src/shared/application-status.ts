export const applicationStatuses = [
  'sent',
  'viewed',
  'test_task',
  'invited',
  'interview',
  'offer',
  'rejected',
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];
