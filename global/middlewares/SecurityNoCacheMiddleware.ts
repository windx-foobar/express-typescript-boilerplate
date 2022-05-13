import { Request, Response, NextFunction } from 'express';
import * as helmet from 'helmet';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class SecurityNoCacheMiddleware implements ExpressMiddlewareInterface {
  public use(req: Request, res: Response, next: NextFunction): any {
    if (req.headers['x-client-cache']) {
      return next();
    }

    return helmet.noCache()(req, res, next);
  }
}
