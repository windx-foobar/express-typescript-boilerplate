#!/usr/bin/env ts-node

import 'tsconfig-paths/register';
import 'reflect-metadata';

import { bootstrapMicroframework } from 'microframework-w3tec';
import { databaseLoader, winstonLoader } from '@packages/core/loaders';
import { mailerLoader } from '@packages/mailer';
import { cliLoader } from '@packages/cli';
import { Logger } from '@packages/core/lib';

const log = new Logger('wxconsole');

process.env.NODE_ENV = 'cli';

bootstrapMicroframework({
  /**
   * Loader is a place where you can configure all your modules during microframework
   * bootstrap process. All loaders are executed one by one in a sequential order.
   */
  loaders: [
    winstonLoader,
    mailerLoader,
    databaseLoader,
    cliLoader
  ]
})
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.log(error);

    log.error('CLI Error', error);
    process.exit(1);
  });
