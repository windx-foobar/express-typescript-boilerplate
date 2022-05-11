import { HttpError } from 'routing-controllers';
import { ValidationError } from 'sequelize';

type AllowedErrors = ValidationError;

export class BadRequestError extends HttpError {
  public static from(error: AllowedErrors) {
    if (error instanceof ValidationError) {
      const transformed = {};

      for (const errorItem of error.errors) {
        if (errorItem.path) {
          const name = errorItem.path.split('.').slice(0, 1).join('');
          transformed[name] = errorItem.message;
        }
      }

      return new this('Validation error', transformed);
    }

    return new this('Unrecognized error');
  }

  public name = 'BadRequestError';
  public errors: any;

  constructor(message?: string, errors?: any) {
    super(400);
    Object.setPrototypeOf(this, BadRequestError.prototype);

    if (message) this.message = message;
    if (errors) this.errors = errors;
  }

  public toJSON() {
    return {
      status: this.httpCode,
      message: this.message,
      errors: this.errors
    };
  }
}
