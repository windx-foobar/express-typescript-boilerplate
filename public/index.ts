import 'reflect-metadata';

import moduleAlias from 'module-alias';
import packageJson from '../package.json';
import { bootstrapMicroframework } from 'microframework-w3tec';

import { replacePathToProduction } from '../packages/core/lib/env';

moduleAlias.addAliases({
  ...packageJson._moduleAliases,
  '@': replacePathToProduction('./'),
  '@packages': replacePathToProduction('packages'),
  '@app': replacePathToProduction('app')
});

import { banner } from '@packages/core/lib/banner';
import { Logger } from '@packages/core/lib/logger';
import {
  expressLoader,
  iocLoader,
  publicLoader,
  sequelizeLoader,
  winstonLoader,
  homeLoader,
  passportLoader
} from '@packages/core/loaders';
// import { eventDispatchLoader } from '@packages/core/loaders/eventDispatchLoader';
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
    // eventDispatchLoader,
    sequelizeLoader,
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
