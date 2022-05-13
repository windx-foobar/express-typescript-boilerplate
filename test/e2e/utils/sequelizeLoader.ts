import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Container } from 'typedi';
import { Sequelize } from 'sequelize-typescript';

import { createDatabaseConnection } from '../../utils/database';

export const sequelizeLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined
) => {
  const connection = await createDatabaseConnection();

  Container.set({
    id: 'Sequelize',
    value: (): Sequelize => connection
  });

  if (settings) {
    settings.setData('connection', connection);
    settings.onShutdown(() => connection.close());
  }
};
