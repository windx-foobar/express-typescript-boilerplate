import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';
import { Logger, LoggerInterface } from '@packages/core/decorators';
import { config } from '@packages/core/config';

@Middleware({ type: 'before' })
export class LogMiddleware implements ExpressMiddlewareInterface {
  constructor(
    @Logger(__filename) private log: LoggerInterface
  ) {}

  public use(req: Request, res: Response, next: NextFunction): any {
    return morgan(config.log.output, {
      stream: {
        write: this.log.info.bind(this.log)
      }
    })(req, res, next);
  }
}
