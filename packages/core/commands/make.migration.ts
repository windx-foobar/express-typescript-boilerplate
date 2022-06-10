import moment from 'moment';

import { config } from '@packages/core/config';

import { MakeCommand } from './abstracts/make';

export class MakeMigrationCommand extends MakeCommand {
  private _outputPath = '';

  constructor() {
    super();

    this.registerOption(
      '--output-path <path>',
      'Директория куда сгенерируется миграция',
      config.app.dirs.migrationsDir
    );
  }

  protected get name() {
    return 'make.migration';
  }

  protected get description() {
    return 'Создание заглушки миграции';
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

    this.log('Начало создания файла миграции из заглушки');
    try {
      await this.render(name, 'migration');
      this.success('Команда успешно выполнилась!');
    } catch (error) {
      this.log(error);
      this.error('Команда выполнилась с ошибкой!');
    }
  }
}

new MakeMigrationCommand().start();
