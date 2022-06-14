interface SentMessageInfo {
  messageId: string | number;
  response: string;
  to: string;
  subject: string;
}

export interface AdapterInterface {
  setFrom(value: string): void;

  sendFromHtml(subject: string, html: string, to: string): Promise<SentMessageInfo>;

  sendFromText(subject: string, text: string, to: string): Promise<SentMessageInfo>;

  close(): void;
}

export interface FileTransportOptions {
  folder?: string;
}

export { Options as TransportOptions } from 'nodemailer/lib/smtp-transport';
