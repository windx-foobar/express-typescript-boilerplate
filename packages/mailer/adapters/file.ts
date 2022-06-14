import fs from 'fs';
import path from 'path';
import moment from 'moment';

import { FileTransportOptions, AdapterInterface } from './interface';

export class FileAdapter implements AdapterInterface {
  constructor(
    private options: FileTransportOptions
  ) {}

  public close(): void {
    return;
  }

  public sendFromHtml(subject: string, html: string, to: string) {
    return this.universalSendFrom(subject, html, to, 'html');
  }

  public sendFromText(subject: string, text: string, to: string) {
    return this.universalSendFrom(subject, text, to, 'txt');
  }

  public setFrom(value: string): void {
    return;
  }

  private async universalSendFrom(subject: string, content: string, to: string, ext = 'html') {
    try {
      const messageId = `mail_${moment().format('HH-mm-ss-SSS')}`;

      await this.createFile(messageId + `.${ext}`, content);

      return {
        messageId,
        response: content,
        to
      };
    } catch (error) {
      throw error;
    }
  }

  private resolveMailsFolder(...paths: string[]) {
    return path.resolve(
      process.cwd(),
      this.options.folder,
      moment().format('YYYY/MM/DD'),
      ...paths
    );
  }

  private async createFile(fileName: string, content: string) {
    try {
      const mailsFolder = this.resolveMailsFolder();
      const filePath = this.resolveMailsFolder(fileName);

      if (!fs.existsSync(mailsFolder)) {
        await fs.promises.mkdir(mailsFolder, {
          recursive: true
        });
      }

      await fs.promises.writeFile(filePath, content);
    } catch (error) {
      throw error;
    }
  }
}
