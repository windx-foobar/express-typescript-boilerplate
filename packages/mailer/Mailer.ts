import path from 'path';
import fs from 'fs';
import Mustache from 'mustache';

import { LoggerInterface } from '@packages/core/decorators';
import { InternalServerError } from '@packages/core/errors';
import { config } from '@packages/core/config';

import { AdapterInterface } from './adapters/interface';

type SendMode = 'html' | 'raw' | 'text' | 'template';

interface SendOptions {
  subject: string;
  content: string;
  to: string;
  mode?: SendMode;
  templateData?: object | any;
}

export class Mailer {
  constructor(
    private $adapter: AdapterInterface,
    private $logger: LoggerInterface,
    private disableDebug: boolean = false
  ) {}

  private get templateExtension() {
    return config.mail.viewsExtenstion;
  }

  public async send(options: SendOptions) {
    const { mode = 'html', subject, to, content, templateData = {} } = options;

    let output;

    try {
      if (mode === 'html') {
        output = await this.$adapter.sendFromHtml(subject, content, to);
      }

      if (['text', 'raw'].includes(mode)) {
        output = await this.$adapter.sendFromText(subject, content, to);
      }

      if (mode === 'template') {
        let templateName = content.replace('(.*)\..*', '$1');
        templateName += this.templateExtension;

        const templatePath = this.resolveTemplate(templateName);

        if (!fs.existsSync(templatePath)) {
          throw new Error('Шаблон для отправки не найден');
        }

        const templateContent = await fs.promises.readFile(templatePath);
        const render = Mustache.render(templateContent.toString(), templateData);

        output = await this.$adapter.sendFromHtml(subject, render, to);
      }

      if (!this.disableDebug && !config.isProduction) {
        this.$logger.debug('Send mail', {
          ...output,
          response: (output?.response as string).length > 150 ?
            (output.response as string).slice(0, 150) + '...' :
            output.response
        });
      }
    } catch (error: any) {
      this.$logger.error(error.message, error);
      throw new InternalServerError('Ошибка отправки письма с подтверждением');
    }
  }

  public close() {
    return this.$adapter.close();
  }

  private resolveTemplate(...paths: string[]): string {
    return path.resolve(process.cwd(), config.app.dirs.views.mailer, ...paths);
  }
}
