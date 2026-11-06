export type MailConnection = { status: 'disconnected' } | { status: 'connected'; address: string };

export interface MailApi {
  getConnection: () => Promise<MailConnection>;
  connectGmail: () => Promise<MailConnection>;
}
