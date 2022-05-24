import { Application } from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createExpressServer } from 'routing-controllers';
import { config } from '../config';
import { getPath } from '../lib/env';

import { authorizationChecker } from '../auth/authorizationChecker';

/**
 * expressLoader
 * ------------------------------
 * Загрузчик express приложения
 */
export const expressLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
): void => {
  if (settings) {
    const connection = settings.getData('connection');
    const passport = settings.getData('passport');

    /**
     * We create a new express server instance.
     * //We could have also use useExpressServer here to attach controllers to an existing express instance.
     */
    const expressApp: Application = createExpressServer({
      cors: true,
      classTransformer: true,
      routePrefix: config.app.routePrefix,
      defaultErrorHandler: false,
      /**
       * We can add options about how routing-controllers should configure itself.
       * Here we specify what controllers should be registered in our express server.
       */
      controllers: config.app.dirs.controllers,
      middlewares: [getPath('global/middlewares/*Middleware.ts')],

      /**
       * Authorization features
       */
      authorizationChecker: authorizationChecker(connection, passport),
      currentUserChecker: async (action) => action.request.user
    });

    // Run application to listen on given port
    if (!config.isTest) {
      const server = expressApp.listen(config.app.port);
      settings.setData('express_server', server);
    }

    // Here we can set the data for other loaders
    settings.setData('express_app', expressApp);
  }
};
