import { Command } from '@packages/cli';
import { config } from '@packages/core/config';

export abstract class DbCommand extends Command {
  protected constructor() {
    super();

    this.$adapter.version(config.app.version);

    this.registerOption('--host <host>', 'Хост базы данных', config.db.host)
      .registerOption('--port <port>', 'Порт базы данных', config.db.port)
      .registerOption('-U, --username <username>', 'Пользователь базы данных', config.db.username)
      .registerOption('-P, --password <password>', 'Пароль базы данных', config.db.password)
      .registerOption('-T, --type <type>', 'Тип базы данных', config.db.type)
      .registerOption('--name <name>', 'Наименование базы данных', config.db.database);
  }

  protected get name() {
    return 'db.command';
  }

  protected get lang() {
    return {
      // TODO: Посмотреть как в Laravel
      'No migrations were.*': 'Никакие миграции не выполнились. Схема уже обновлена!',
      'reverting': 'откат',
      'reverted': 'откатилось',
      'migrating': 'выполнение миграции',
      'migrated': 'выполнено',
      'No executed migrations found.*': 'Не найдено миграций для отката.',
      '.*cannot drop table.*': 'Невозможно удалить таблицу, потому что от нее зависят другие!'
    };
  }

  protected filterLogMessageFromSequelize(value: any): boolean {
    if (!value || typeof value !== 'string') return false;

    return !/(Sequelize CLI|Parsed url)/.test(value);
  }

  protected translateFromSequelize(value: any): string {
    let result = value;

    for (const strOrRegex of Object.keys(this.lang)) {
      const regex = new RegExp(strOrRegex);

      if (regex.test(value)) {
        result = result.replace(regex, this.lang[strOrRegex]);
      }
    }

    return result;
  }

  protected stepConnectionString(options: any) {
    const { host, port, username, password, type, name } = options;

    this.log(`Строка подключения - ${type}://${username}:****@${host}:${port}/${name}`);

    return `${type}://${username}:${password}@${host}:${port}/${name}`;
  }
}
