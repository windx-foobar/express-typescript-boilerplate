import path from 'path';
import * as dotenv from 'dotenv';
import {
  getOsEnv,
  getOsEnvOptional,
  getOsPath,
  getOsPaths,
  normalizePort,
  toBool,
  toNumber
} from '../lib';

import * as _pkg from '@/package.json';

const envName = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({
  path: path.join(
    process.cwd(),
    envName
  )
});

const nodeEnv = process.env.NODE_ENV || 'development';
const pkg = _pkg as any;
export const config = {
  node: nodeEnv,
  isProduction: nodeEnv === 'production',
  isTest: nodeEnv === 'test',
  isDevelopment: nodeEnv === 'development',
  isStaging: process.env.NODE_ENV === 'staging',
  app: {
    name: getOsEnv('APP_NAME'),
    version: pkg.version,
    description: pkg.description,
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
      middlewares: getOsPaths('MIDDLEWARES'),
      subscribers: getOsPaths('SUBSCRIBERS'),
      views: {
        mailer: getOsPath('MAIL_VIEWS')
      }/*,
       interceptors: getOsPaths('INTERCEPTORS'),
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
  },
  mail: {
    type: getOsEnvOptional('MAIL_MAILER', 'smtp'),
    viewsExtenstion: getOsEnvOptional('MAIL_VIEWS_EXT', '.tpl'),
    types: {
      smtp: {
        transport: 'smtp',
        host: getOsEnvOptional('MAIL_HOST'),
        port: getOsEnvOptional('MAIL_PORT'),
        username: getOsEnvOptional('MAIL_USERNAME'),
        password: getOsEnvOptional('MAIL_PASSWORD'),
        secure: toBool(getOsEnvOptional('MAIL_SECURE', 'false'))
      },
      console: {},
      file: {
        folder: getOsEnvOptional('MAIL_FOLDER', 'mails')
      }
    }
  }
};
