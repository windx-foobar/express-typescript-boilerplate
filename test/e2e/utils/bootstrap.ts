import { Application } from 'express';
import { Server } from 'http';
import { bootstrapMicroframework } from 'microframework-w3tec';
import { Sequelize } from 'sequelize-typescript';
import { PassportStatic } from 'passport';

import {
  expressLoader,
  homeLoader,
  iocLoader,
  winstonLoader,
  passportLoader
} from '@packages/core/loaders';
import { sequelizeLoader } from './sequelizeLoader';

export interface BootstrapSettings {
  app: Application;
  server: Server;
  connection: Sequelize;
  passport: PassportStatic;
}

export const bootstrapApp = async (): Promise<BootstrapSettings> => {
  const framework = await bootstrapMicroframework({
    loaders: [
      winstonLoader,
      iocLoader,
      // eventDispatchLoader,
      sequelizeLoader,
      passportLoader,
      expressLoader,
      homeLoader
    ]
  });
  return {
    app: framework.settings.getData('express_app') as Application,
    server: framework.settings.getData('express_server') as Server,
    connection: framework.settings.getData('connection') as Sequelize,
    passport: framework.settings.getData('passport') as PassportStatic
  } as BootstrapSettings;
};
