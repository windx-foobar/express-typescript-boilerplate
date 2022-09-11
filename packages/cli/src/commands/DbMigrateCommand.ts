import { Command as CommanderCommand } from 'commander';

import { config } from '@packages/core/config';

import { Command } from '../decorators/Command';
import { DbCommand } from '../lib/abstracts/DbCommand';
// import { spawnWithEvents } from '@packages/core/utils';

@Command({
  name: 'migrate',
  arguments: [],
  description: 'Запуск миграций базы данных',
  options: [
    [
      '--migrations-path <path>',
      'Директория с миграциями',
      config.app.dirs.migrationsDir
    ]
  ]
})
export default class DbMigrateCommand extends DbCommand {
  public handle(options: CommanderCommand): Promise<any> {
    console.log('TO BE DONE!');
    return Promise.resolve();
  }

  // TODO: Адаптировать реализацию

  // protected async handle(options: any): Promise<any> {
  //   // 1. Сборка строки для sequelize-cli
  //   const connectionString = this.stepConnectionString(options);
  //
  //   // 2. Выполнение команды sequelize-cli (db:migrate)
  //   await this.stepHandleSequelizeCommand(connectionString, options);
  // }
  //
  // private async stepHandleSequelizeCommand(connectionString: string, options: any) {
  //   const { migrationsPath } = options;
  //
  //   if (!migrationsPath) return this.error('Путь до миграций не указан в опциях');
  //   if (!connectionString) return this.error('Не собрана строка подключения к базе');
  //
  //   const commandArgs = [
  //     '-T',
  //     `${process.cwd()}/node_modules/sequelize-cli/lib/sequelize`,
  //     'db:migrate',
  //     `--migrations-path=${migrationsPath}`,
  //     `--url=${connectionString}`
  //   ];
  //
  //   this.log('Запуск команды\n', `\tts-node ${commandArgs.join(' ')}`);
  //   const child = await spawnWithEvents('ts-node', commandArgs);
  //
  //   child.stdout.on('data', (data: Buffer) => {
  //     const logData = data.toString().trim();
  //
  //     if (this.filterLogMessageFromSequelize(logData)) {
  //       this.externalLog('Sequelize CLI', 'yellow', this.translateFromSequelize(logData));
  //     }
  //   });
  //
  //   child.stderr.on('data', (data: Buffer) => {
  //     const logData = data.toString().trim();
  //
  //     if (this.filterLogMessageFromSequelize(logData)) {
  //       this.externalLog('Sequelize CLI', 'red', this.translateFromSequelize(logData));
  //     }
  //   });
  //
  //   child.on('exit', (code) => {
  //     if (+code === 1) {
  //       this.error('Команда выполнилась с ошибкой!');
  //     } else {
  //       this.success('Команда успешно выполнилась!');
  //     }
  //   });
  // }
}
