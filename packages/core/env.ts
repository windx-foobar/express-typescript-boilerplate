import 'module-alias/register';

import * as dotenv from 'dotenv';
import * as path from 'path';

import * as pkg from '@/package.json';
import {
  getOsEnv, getOsEnvOptional, getOsPath, getOsPaths, normalizePort, toBool, toNumber
} from './lib/env';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({
  path: path.join(
    process.cwd(),
    `.env${(
      (
        process.env.NODE_ENV === 'test'
      ) ? '.test' : ''
    )}`
  )
});

/**
 * Environment variables
 */
export const env = {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  app: {
    name: getOsEnv('APP_NAME'),
    version: (
      pkg as any
    ).version,
    description: (
      pkg as any
    ).description,
    host: getOsEnv('APP_HOST'),
    schema: getOsEnv('APP_SCHEMA'),
    routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
    port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
    banner: toBool(getOsEnv('APP_BANNER')),
    dirs: {
      migrations: getOsPaths('SEQUELIZE_MIGRATIONS'),
      migrationsDir: getOsPath('SEQUELIZE_MIGRATIONS_DIR'),
      entities: getOsPaths('SEQUELIZE_ENTITIES'),
      entitiesDir: getOsPath('SEQUELIZE_ENTITIES_DIR'),
      controllers: getOsPaths('CONTROLLERS'),
      middlewares: getOsPaths('MIDDLEWARES')/*,
       interceptors: getOsPaths('INTERCEPTORS'),
       subscribers: getOsPaths('SUBSCRIBERS'),
       resolvers: getOsPaths('RESOLVERS')*/
    }
  },
  log: {
    level: getOsEnv('LOG_LEVEL'),
    json: toBool(getOsEnvOptional('LOG_JSON')),
    output: getOsEnv('LOG_OUTPUT')
  },
  db: {
    type: getOsEnv('SEQUELIZE_CONNECTION'),
    host: getOsEnvOptional('SEQUELIZE_HOST'),
    port: toNumber(getOsEnvOptional('SEQUELIZE_PORT')),
    username: getOsEnvOptional('SEQUELIZE_USERNAME'),
    password: getOsEnvOptional('SEQUELIZE_PASSWORD'),
    database: getOsEnv('SEQUELIZE_DATABASE')/*,
     synchronize: toBool(getOsEnvOptional('SEQUELIZE_SYNCHRONIZE')),
     logging: toBool(getOsEnv('SEQUELIZE_LOGGING'))*/
  }/*,
   graphql: {
   enabled: toBool(getOsEnv('GRAPHQL_ENABLED')),
   route: getOsEnv('GRAPHQL_ROUTE'),
   editor: toBool(getOsEnv('GRAPHQL_EDITOR'))
   },
   swagger: {
   enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
   route: getOsEnv('SWAGGER_ROUTE'),
   file: getOsEnv('SWAGGER_FILE'),
   username: getOsEnv('SWAGGER_USERNAME'),
   password: getOsEnv('SWAGGER_PASSWORD')
   },
   monitor: {
   enabled: toBool(getOsEnv('MONITOR_ENABLED')),
   route: getOsEnv('MONITOR_ROUTE'),
   username: getOsEnv('MONITOR_USERNAME'),
   password: getOsEnv('MONITOR_PASSWORD')
   }*/
};
