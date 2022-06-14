import 'reflect-metadata';

import { bootstrapMicroframework } from 'microframework-w3tec';

import { banner } from '@packages/core/lib/banner';
import { Logger } from '@packages/core/lib/logger';
import {
  expressLoader,
  iocLoader,
  publicLoader,
  databaseLoader,
  winstonLoader,
  homeLoader,
  passportLoader,
  eventDispatchLoader
} from '@packages/core/loaders';
import { mailerLoader } from '@packages/mailer';
// import { graphqlLoader } from './loaders/graphqlLoader';
// import { monitorLoader } from './loaders/monitorLoader';
// import { swaggerLoader } from './loaders/swaggerLoader';

/**
 * EXPRESS TYPESCRIPT BOILERPLATE
 * ----------------------------------------
 *
 * This is a boilerplate for Node.js Application written in TypeScript.
 * The basic layer of this app is express. For further information visit
 * the 'README.md' file.
 */
const log = new Logger(__filename);

bootstrapMicroframework({
  /**
   * Loader is a place where you can configure all your modules during microframework
   * bootstrap process. All loaders are executed one by one in a sequential order.
   */
  loaders: [
    winstonLoader,
    iocLoader,
    mailerLoader,
    eventDispatchLoader,
    databaseLoader,
    passportLoader,
    expressLoader,
    // swaggerLoader,
    // monitorLoader,
    homeLoader,
    publicLoader
    // graphqlLoader
  ]
})
  .then(() => banner(log))
  .catch((error: Error) => log.error(error.message));
