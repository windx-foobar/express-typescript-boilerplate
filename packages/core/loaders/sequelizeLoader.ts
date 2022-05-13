import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { SequelizeOptions, Sequelize } from 'sequelize-typescript';
import { Container } from 'typedi';
import { config } from '../config';

export const sequelizeLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined
): Promise<void> => {
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
    logging: config.isProduction ? false : console.log,
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
