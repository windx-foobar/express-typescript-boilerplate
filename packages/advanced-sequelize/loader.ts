import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { SequelizeOptions, Sequelize } from 'sequelize-typescript';
import { Container } from 'typedi';
import { config } from '@packages/core/config';
import { Logger } from '@packages/core/lib/logger';

/**
 * sequelizeLoader
 * ------------------------------
 * Загрузчик движка sequelize. Определение логгинга и моделей, а так же определение его в контейнере
 * для использования декоратора @Sequelize
 */
export const sequelizeLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined
): Promise<void> => {
  const logger = new Logger('sequelize');

  const connectionOptions: SequelizeOptions = {
    dialect: config.db.type as any,
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    pool: {
      min: 0,
      max: 5,
      idle: 10000
    },
    logging: config.isProduction ? false : (message: any) => logger.info(message),
    models: [config.app.dirs.entitiesDir]
  };

  const connection = new Sequelize(connectionOptions);

  try {
    await connection.authenticate();

    Container.set({
      id: 'Sequelize',
      value: (): Sequelize => connection
    });

    if (settings) {
      settings.setData('connection', connection);
      settings.onShutdown(() => connection.close());
    }
  } catch (error) {
    throw error;
  }
};
