import { Application } from 'express';
import { Server } from 'http';
import { bootstrapMicroframework } from 'microframework-w3tec';
import { Sequelize } from 'sequelize-typescript';

import {
  expressLoader,
  homeLoader,
  iocLoader,
  winstonLoader
} from '@packages/core/loaders';
import { sequelizeLoader } from './sequelizeLoader';

export interface BootstrapSettings {
  app: Application;
  server: Server;
  connection: Sequelize;
}

export const bootstrapApp = async (): Promise<BootstrapSettings> => {
  const framework = await bootstrapMicroframework({
    loaders: [
      winstonLoader,
      iocLoader,
      // eventDispatchLoader,
      sequelizeLoader,
      expressLoader,
      homeLoader
    ]
  });
  return {
    app: framework.settings.getData('express_app') as Application,
    server: framework.settings.getData('express_server') as Server,
    connection: framework.settings.getData('connection') as Sequelize
  } as BootstrapSettings;
};
