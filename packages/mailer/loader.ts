import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { Container } from 'typedi';

import { config } from '@packages/core/config';
import { Mailer } from '@packages/mailer';
import {
  NodemailerAdapter,
  ConsoleAdapter,
  FileAdapter,
  AdapterInterface,
  TransportOptions
} from '@packages/mailer/adapters';
import { Logger } from '@packages/core/lib/logger';

/**
 * sequelizeLoader
 * ------------------------------
 * Загрузчик движка sequelize. Определение логгинга и моделей, а так же определение его в контейнере
 * для использования декоратора @Sequelize
 */
export const mailerLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined
): Promise<void> => {
  let adapter: AdapterInterface;

  const logger = new Logger('mailer');
  const transportConfig = config.mail.types[config.mail.type];

  if (!transportConfig) {
    logger.error('Конфиг для mailer не найден');
    throw new Error('Mailer loader error');
  }

  const mailerOptions: TransportOptions = {
    host: transportConfig.host,
    port: transportConfig.port,
    secure: transportConfig.secure,
    tls: {
      rejectUnauthorized: false
    }
  };

  if (transportConfig.username && transportConfig.password) {
    mailerOptions.auth = {
      user: transportConfig.username,
      pass: undefined
    };

    if (transportConfig.password) {
      mailerOptions.auth.pass = transportConfig.password;
    }
  }

  switch (config.mail.type) {
    case 'smtp':
      logger.info('Mailer transport: SMTP');
      adapter = new NodemailerAdapter(mailerOptions);
      break;

    case 'console':
      logger.info('Mailer trasnport: CONSOLE');
      adapter = new ConsoleAdapter(logger);
      break;

    case 'file':
      logger.info('Mailer transport: FILE');
      adapter = new FileAdapter(transportConfig);
      break;

    default:
      throw new Error('Unrecognized adapter');
  }

  const mailer = new Mailer(adapter, logger, config.mail.type === 'console');

  try {
    Container.set({
      id: 'Mailer',
      value: (): Mailer => mailer
    });

    if (settings) {
      settings.setData('mailer', mailer);
      settings.onShutdown(() => mailer.close());
    }
  } catch (error) {
    throw error;
  }
};
