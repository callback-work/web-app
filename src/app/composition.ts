import type { AdaptationApi } from '../features/adaptation';
import { FakeAdaptationApi } from '../features/adaptation/testing';
import type { MailApi } from '../features/mail-connect';
import { FakeMailApi } from '../features/mail-connect/testing';
import type { TrackerApi } from '../features/tracker';
import { FakeTrackerApi } from '../features/tracker/testing';

export interface Services {
  adaptationApi: AdaptationApi;
  trackerApi: TrackerApi;
  mailApi: MailApi;
}

export function createServices(): Services {
  return {
    adaptationApi: new FakeAdaptationApi(),
    trackerApi: new FakeTrackerApi(),
    mailApi: new FakeMailApi(),
  };
}
