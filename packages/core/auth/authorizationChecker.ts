import { Action } from 'routing-controllers';
import { Sequelize } from 'sequelize-typescript';
import { PassportStatic } from 'passport';
import { UnauthorizedError, ForbiddenError } from '@packages/core/errors';

import { Logger } from '../lib/logger';

export function authorizationChecker(
  connection: Sequelize,
  passport: PassportStatic
): (
  action: Action,
  [roles, permissions]: any[]
) => Promise<boolean> | boolean {
  const log = new Logger(__filename);

  return function innerAuthorizationChecker(
    action: Action,
    [roles, permissions]: any[]
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      passport.authenticate(
        'basic',
        async (err, user) => {
          const transaction = await connection.transaction();

          try {
            if (err) {
              log.error(err);
              return reject(err);
            }

            if (!user) {
              log.warn('Invalid credentials');
              return reject(new UnauthorizedError('Требуется авторизация'));
            }

            const canAction = await user.can(permissions, {
              transaction,
              rolesNames: roles
            });
            if (!canAction) return reject(new ForbiddenError('Недостаточно прав'));

            await transaction.commit();
            action.request.user = user;
            return resolve(true);
          } catch (error) {
            return reject(error);
          }
        }
      )(action.request, action.response, action.next);
    });
  };
}
