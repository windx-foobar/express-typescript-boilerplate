import compression from 'compression';
import { Request, Response, NextFunction } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class CompressionMiddleware implements ExpressMiddlewareInterface {
  public use(req: Request, res: Response, next: NextFunction): any {
    if (req.headers['x-no-compression']) {
      return next();
    }

    return compression()(req, res, next);
  }
}
