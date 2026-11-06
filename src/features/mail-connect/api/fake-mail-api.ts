import type { MailApi, MailConnection } from './mail-api';

const disconnected: MailConnection = { status: 'disconnected' };

export class FakeMailApi implements MailApi {
  private connection: MailConnection;
  private failure: Error | undefined;

  constructor(connection = disconnected) {
    this.connection = connection;
  }

  failNextWith(error: Error): void {
    this.failure = error;
  }

  async getConnection(): Promise<MailConnection> {
    await Promise.resolve();
    return this.connection;
  }

  async connectGmail(): Promise<MailConnection> {
    await Promise.resolve();
    const { failure } = this;
    this.failure = undefined;

    if (failure !== undefined) {
      throw failure;
    }

    this.connection = { status: 'connected', address: 'you@gmail.com' };
    return this.connection;
  }
}
