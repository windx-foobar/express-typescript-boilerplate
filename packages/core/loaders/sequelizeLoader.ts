import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { SequelizeOptions, Sequelize } from 'sequelize-typescript';
// import { glob } from '@packages/core/utils';
import { Container } from 'typedi';

import { env } from '../env';

export const sequelizeLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined
): Promise<void> => {
  const connectionOptions: SequelizeOptions = {
    dialect: env.db.type as any,
    host: env.db.host,
    port: env.db.port,
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    pool: {
      min: 0,
      max: 5,
      idle: 10000
    },
    models: [env.app.dirs.entitiesDir]
  };

  const connection = new Sequelize(connectionOptions);

  /*await Promise.all(
   env.app.dirs.entities.map(async (path: string) => {
   const modelPaths = await glob(path);

   modelPaths.forEach((modelPath: string) => {
   require(modelPath).default.initialize({
   sequelize: connection
   });
   });
   })
   );

   Object.keys(connection.models)
   .forEach((modelName: string) => {
   const model = connection.models[modelName] as any;
   model.association(connection.models);
   });*/

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
