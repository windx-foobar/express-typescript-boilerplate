import { config } from '@packages/core/config';

import { AbstractCommand } from './.';

export abstract class DbCommand extends AbstractCommand {
  public namespace = 'db';
  public options: Array<[string, string, any?]> = [
    ['--host <host>', 'Хост базы данных', config.db.host],
    ['--port <port>', 'Порт базы данных', config.db.port],
    ['-U, --username <username>', 'Пользователь базы данных', config.db.username],
    ['-P, --password <password>', 'Пароль базы данных', config.db.password],
    ['-T, --type <type>', 'Тип базы данных', config.db.type],
    ['--name <name>', 'Наименование базы данных', config.db.database]
  ];
}
