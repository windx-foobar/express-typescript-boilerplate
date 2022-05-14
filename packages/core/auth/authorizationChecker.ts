import { Action } from 'routing-controllers';
import { Sequelize } from 'sequelize-typescript';
import { UnauthorizedError } from '@packages/core/errors';
import passport from 'passport';

import { Logger } from '../lib/logger';

export function authorizationChecker(
  connection: Sequelize
): (action: Action, roles: any[]) => Promise<boolean> | boolean {
  const log = new Logger(__filename);

  return function innerAuthorizationChecker(
    action: Action,
    roles: string[]
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      passport.authenticate(
        'basic',
        (err, user) => {
          if (err) {
            log.error(err);
            return reject(err);
          }

          if (!user) {
            log.warn('Invalid credentials');
            return reject(new UnauthorizedError('Требуется авторизация'));
          }

          action.request.user = user;
          return resolve(true);
        }
      )(action.request, action.response, action.next);
    });
  };
}
