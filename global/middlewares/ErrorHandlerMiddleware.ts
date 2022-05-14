import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'sequelize';
import { BadRequestError, InternalServerError } from '@packages/core/errors';
import { config } from '@packages/core/config';
import { LoggerInterface, Logger } from '@packages/core/decorators';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  public isProduction = config?.isProduction ?? false;

  constructor(
    @Logger(__filename) private logger: LoggerInterface
  ) {}

  public error(error: any, request: Request, response: Response, next: NextFunction): void {
    switch (true) {
      case error instanceof HttpError:
        break;

      case error instanceof ValidationError:
        error = BadRequestError.from(error);
        break;

      case error instanceof Error:
        error = new InternalServerError(error.message);
        break;

      case true:
      default:
        error = new InternalServerError('Unrecognized error');
    }

    response.status(error?.httpCode || 500)
      .json({
        name: error.name,
        message: error.message,
        errors: error?.errors ?? undefined
      });

    if (this.isProduction) {
      this.logger.error(error.name, error.message);
    } else {
      this.logger.error(error.name, error.stack);
    }
  }
}
