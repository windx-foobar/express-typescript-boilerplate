import * as jsonfile from 'jsonfile';

import * as tsconfig from '@/tsconfig.json';

import { MakeCommand } from './abstracts/make';

export class MakeTsconfigCommand extends MakeCommand {
  constructor() {
    super();
  }

  protected get name() {
    return 'make.tsconfig';
  }

  protected get description() {
    return 'Создание tsconfig.json для продакшена';
  }

  protected get outputPath(): string {
    return process.cwd();
  }

  protected async handle(): Promise<any> {
    // 1. Сохранение tsconfig.build.json в корень
    this.log('Начало создания tsconfig.build.json');
    try {
      await this.render('tsconfig.build.json');
      this.success('Команда успешно выполнилась!');
    } catch (error) {
      this.log(error);
      this.error('Команда выполнилась с ошибкой!');
    }
  }

  protected async render(fileName: string): Promise<void> {
    try {
      const content: any = tsconfig;

      content.compilerOptions.outDir = '.tmp';
      content.include = [
        'app/**/*',
        'database/**/*',
        'packages/**/*',
        'public/**/*',
        'global/**/*'
      ];
      content.exclude = ['node_modules'];

      this.log(`Запись файла ${fileName}`);
      return new Promise((resolve, reject) => {
        jsonfile.writeFile(
          this.outputPath + '/' + fileName,
          content,
          { spaces: 2 },
          (err: Error) => {
            if (err === null) {
              this.log('Запись успешно завершена');

              resolve();
            } else {
              this.error(`Ошибка в создании файла ${fileName}`, err);

              reject(err);
            }
          }
        );
      });
    } catch (error) {
      throw error;
    }
  }
}

new MakeTsconfigCommand().start();
