import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { config } from '../config';
import path from 'path';

export const winstonLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
): void => {
  const transports: any[] = [];

  if (config.isProduction) {
    transports.push(
      new winston.transports.DailyRotateFile({
        level: config.log.level,
        filename: 'production-log',
        extension: '.log',
        dirname: path.resolve(process.cwd(), 'logs'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '2m',
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(({ level, message, timestamp }) => {
            try {
              const parsed = JSON.parse(message);

              return `[${timestamp}][${level}] ${parsed}`;
            } catch (error) {
              return `[${timestamp}][${level}] ${message}`;
            }
          })
        ),
        maxFiles: '7d'
      })
    );
  } else {
    transports.push(
      new winston.transports.Console({
        level: config.log.level,
        handleExceptions: true,
        format: config.node !== 'development'
          ? winston.format.combine(winston.format.json())
          : winston.format.combine(winston.format.colorize(), winston.format.simple())
      })
    );
  }

  winston.configure({ transports });
};
