import { describe, expect, it } from 'vitest';

import { applicationStatuses } from '../../../shared/application-status';
import type { ApplicationStatus } from '../../../shared/application-status';
import { summarizeApplications } from './summarize-applications';

const withStatuses = (...statuses: ApplicationStatus[]) => statuses.map((status) => ({ status }));

describe('summarizeApplications()', () => {
  describe('critical user paths', () => {
    it('раскладывает отклики по этапам', () => {
      const summary = summarizeApplications(
        withStatuses('sent', 'viewed', 'test_task', 'invited', 'interview', 'offer', 'rejected'),
      );

      expect(summary).toStrictEqual({
        total: 7,
        byStage: { waiting: 2, 'in-progress': 3, offer: 1, rejected: 1 },
      });
    });
  });

  describe('edge cases', () => {
    it('возвращает нули, когда откликов нет', () => {
      expect(summarizeApplications([])).toStrictEqual({
        total: 0,
        byStage: { waiting: 0, 'in-progress': 0, offer: 0, rejected: 0 },
      });
    });

    it.each(applicationStatuses)('учитывает статус %s ровно в одном этапе', (status) => {
      const { byStage } = summarizeApplications(withStatuses(status));

      expect(Object.values(byStage).reduce((sum, count) => sum + count, 0)).toBe(1);
    });
  });
});
