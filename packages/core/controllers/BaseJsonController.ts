import { HttpError } from 'routing-controllers';
import { BadRequestError, InternalServerError } from '@packages/core/errors';
import { ValidationError } from 'sequelize';

export abstract class BaseJsonController {
  protected handleError(error: any) {
    const self = this as any;

    if (typeof error?.toJSON === 'function' || error instanceof HttpError) {
      return error;
    }

    switch (true) {
      case error instanceof ValidationError:
        return BadRequestError.from(error);

      case error instanceof Error:
        return new InternalServerError(error.message);

      case true:
      default:
        if (self.logger) {
          self.logger.error('Unrecognized error', {
            message: error.message
          });
        }

        return new InternalServerError('Unrecognized error');
    }
  }
}
