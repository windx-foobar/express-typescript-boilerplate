import { createTransport, Transporter } from 'nodemailer';

import { config } from '@packages/core/config';

import { AdapterInterface, TransportOptions } from './interface';

export class NodemailerAdapter implements AdapterInterface {
  private transporter: Transporter;

  constructor(options: TransportOptions) {
    this.transporter = this.createTransport(options);
  }

  public setFrom(value: string) {
    return;
  }

  public async sendFromHtml(subject: string, html: string, to: string) {
    try {
      const info = await this.transporter.sendMail({
        html,
        to,
        subject
      });

      return {
        messageId: info.messageId,
        response: info.response,
        to,
        subject
      };
    } catch (error) {
      throw error;
    }
  }

  public async sendFromText(subject: string, text: string, to: string) {
    try {
      const info = await this.transporter.sendMail({
        text,
        to,
        subject
      });

      return {
        messageId: info.messageId,
        response: info.response,
        to,
        subject
      };
    } catch (error) {
      throw error;
    }
  }

  public close() {
    return this.transporter.close();
  }

  private createTransport(options: TransportOptions) {
    let fromName = config.app.name;

    const fromEmail = options?.auth?.user ?? `admin@${config.app.name}.domain`;
    if (config.isDevelopment) {
      fromName += ' (development)';
    }

    if (config.isStaging) {
      fromName += ' (staging)';
    }

    return createTransport(options, {
      from: `"${fromName}" <${fromEmail}>`
    });
  }
}
