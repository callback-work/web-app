import { defineCatalog } from '../../../shared/i18n';
import type { ru } from './ru';

export const en = defineCatalog<typeof ru>({
  title: 'Email',
  description:
    "Application statuses will update on their own from employers' emails. Read-only access, we don't store email text.",
  checking: 'Checking email connection',
  checkError: "Couldn't check email connection",
  connect: 'Connect Gmail',
  connecting: 'Connecting…',
  connected: 'Gmail connected: {address}',
  connectError: "Couldn't connect Gmail. Please try again",
});
