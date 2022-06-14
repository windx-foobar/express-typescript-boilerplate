import moment from 'moment';

import { LoggerInterface } from '@packages/core/lib/logger';

import { /*TransportOptions,*/ AdapterInterface } from './interface';

export class ConsoleAdapter implements AdapterInterface {
  constructor(
    private logger: LoggerInterface
    // private options: TransportOptions
  ) {}

  public async sendFromHtml(subject: string, html: string, to: string) {
    const messageId = moment().format('DD.MM.YYYY HH:mm:ss');

    this.logger.info(messageId, {
      to,
      content: html,
      date: messageId
    });

    return {
      messageId,
      response: html,
      to,
      subject
    };
  }

  public sendFromText(subject: string, text: string, to: string) {
    return this.sendFromHtml(subject, text, to);
  }

  public setFrom(value: string) {
    return;
  }

  public close(): void {
    return;
  }
}
