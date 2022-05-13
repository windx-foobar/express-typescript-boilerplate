import { Application } from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createExpressServer } from 'routing-controllers';
import { config } from '../config';
import { getPath } from '../lib/env';

// import { authorizationChecker } from '../auth/authorizationChecker';
// import { currentUserChecker } from '../auth/currentUserChecker';

export const expressLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
): void => {
  if (settings) {
    // const connection = settings.getData('connection');

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
      middlewares: [
        getPath('global/middlewares/*Middleware.ts'),
        ...config.app.dirs.middlewares
      ]
      // interceptors: env.app.dirs.interceptors

      /**
       * Authorization features
       */
      // authorizationChecker: authorizationChecker(connection),
      // currentUserChecker: currentUserChecker(connection)
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
