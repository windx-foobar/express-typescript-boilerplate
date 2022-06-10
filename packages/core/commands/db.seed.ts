import path from 'path';

import { spawnWithEvents, glob } from '@packages/core/utils';
import { config } from '@packages/core/config';

import { DbCommand } from './abstracts/db';

export class DbSeedCommand extends DbCommand {
  constructor() {
    super();

    this.registerOption(
      '--seeds-path <path>',
      'Директория с сидерами',
      path.resolve(config.app.dirs.migrationsDir, '../seeds')
    )
      .registerOption(
        '--last',
        'Опция, чтобы запустить только последний сидер'
      );
  }

  protected get name() {
    return 'db.seed';
  }

  protected get description() {
    return 'Заполнение таблиц данными';
  }

  protected get lang() {
    return {
      ...super.lang,
      migrating: 'выполнение сидера'
    };
  }

  protected async handle(options: any, ...args: string[]): Promise<any> {
    // 1. Сборка строки для sequelize-cli
    const connectionString = this.stepConnectionString(options);

    // 2. Сборка файлов сидеров
    const seedNames = await this.makeSeedNamesOption(options, args);
    if (!Array.isArray(seedNames)) return;

    // 3. Выполнение команды sequelize-cli (db:seed | db:seed:all)
    await this.stepHandleSequelizeCommand(connectionString, options, seedNames);
  }

  private async stepHandleSequelizeCommand(
    connectionString: string,
    options: any,
    seedNames: string[]
  ) {
    const { seedsPath } = options;

    if (!seedsPath) return this.error('Путь до миграций не указан в опциях');
    if (!connectionString) return this.error('Не собрана строка подключения к базе');

    const commandArgs = [
      '-T',
      `${process.cwd()}/node_modules/sequelize-cli/lib/sequelize`,
      'db:seed',
      `--seeders-path=${seedsPath}`,
      `--url=${connectionString}`,
      ...(seedNames.length ? seedNames : [])
    ];

    this.log('Запуск команды\n', `\tts-node ${commandArgs.join(' ')}`);
    const child = await spawnWithEvents('ts-node', commandArgs);

    child.stdout.on('data', (data: Buffer) => {
      const logData = data.toString().trim();

      if (this.filterLogMessageFromSequelize(logData)) {
        this.externalLog('Sequelize CLI', 'yellow', this.translateFromSequelize(logData));
      }
    });

    child.stderr.on('data', (data: Buffer) => {
      const logData = data.toString().trim();

      if (this.filterLogMessageFromSequelize(logData)) {
        this.externalLog('Sequelize CLI', 'red', this.translateFromSequelize(logData));
      }
    });

    child.on('exit', (code) => {
      if (+code === 1) {
        this.error('Команда выполнилась с ошибкой!');
      } else {
        this.success('Команда успешно выполнилась!');
      }
    });
  }

  private async makeSeedNamesOption(options: any, names: string[]) {
    const { seedsPath = '', last = false } = options;
    if (!seedsPath) return this.error('Путь до сидеров не указан в опциях');

    let seeds: any[];

    if (!names.length) {
      seeds = await glob(path.resolve(seedsPath, '../seeds/*.ts'));
      seeds = seeds.map((seed) => seed.split('.')[0]);
      seeds = seeds.map((seed) => seed.split('/').slice(-1).join(''));

      if (last) {
        seeds = seeds.slice(-1);
      }
    } else {
      seeds = names;
    }

    if (Array.isArray(seeds)) {
      return seeds.map((name: string) => `--seed=${name}`);
    }

    return [];
  }
}

new DbSeedCommand().start();
