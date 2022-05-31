import { HttpError } from 'routing-controllers';

export class SimpleError extends HttpError {
  constructor() {
    super(500, 'Simple error message');
  }
}
