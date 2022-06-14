import { AdapterInterface } from '@packages/mailer/adapters/interface';

export class MockAdapter implements AdapterInterface {
  public sendFromHtmlMock = jest.fn();
  public sendFromTextMock = jest.fn();

  public close(): void {
    return;
  }

  public async sendFromHtml(subject: string, html: string, to: string) {
    this.sendFromHtmlMock(subject, html, to);

    return {
      messageId: Date.now(),
      response: html,
      to,
      subject
    };
  }

  public async sendFromText(subject: string, text: string, to: string) {
    this.sendFromTextMock(subject, text, to);

    return {
      messageId: Date.now(),
      response: text,
      to,
      subject
    };
  }

  public setFrom(value: string): void {
    return;
  }
}
