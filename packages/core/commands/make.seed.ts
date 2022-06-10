import moment from 'moment';
import path from 'path';

import { config } from '@packages/core/config';

import { MakeCommand } from './abstracts/make';

export class MakeSeedCommand extends MakeCommand {
  private _outputPath = '';

  constructor() {
    super();

    this.registerOption(
      '--output-path <path>',
      'Директория куда сгенерируется сидер',
      path.resolve(config.app.dirs.migrationsDir, '../seeds')
    );
  }

  protected get name() {
    return 'make.seed';
  }

  protected get description() {
    return 'Создание заглушки сидера';
  }

  protected get outputPath(): string {
    return this._outputPath;
  }

  protected async handle(options: any, fileName: string): Promise<any> {
    const { outputPath = '' } = options;
    if (!outputPath) return this.error('Папка, куда сохранять заглушку не указана!');
    if (!fileName) return this.error('Имя файла не указано аргументом');

    // 1. Папка, в которую сохранится заглушка
    this._outputPath = outputPath;

    // 2. Сохранение заглушки в директорию
    const name = `${moment().format('YYYYMMDDHHMMSS')}-${fileName}.ts`;

    this.log('Начало создания файла сидера из заглушки');
    try {
      await this.render(name, 'seed');
      this.success('Команда успешно выполнилась!');
    } catch (error) {
      this.log(error);
      this.error('Команда выполнилась с ошибкой!');
    }
  }
}

new MakeSeedCommand().start();
