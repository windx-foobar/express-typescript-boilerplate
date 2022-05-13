import { Request, Response, NextFunction } from 'express';
import * as helmet from 'helmet';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class SecurityHstsMiddleware implements ExpressMiddlewareInterface {
  public use(req: Request, res: Response, next: NextFunction): any {
    return helmet.hsts({
      maxAge: 31536000,
      includeSubdomains: true
    })(req, res, next);
  }
}
