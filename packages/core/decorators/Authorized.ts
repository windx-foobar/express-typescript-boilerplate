import { getMetadataArgsStorage } from 'routing-controllers';
import { AnyFunction } from '@packages/core/utils';

/**
 * Marks controller action to have a special access.
 * Authorization logic must be defined in routing-controllers settings.
 */
export function Authorized(roleOrRoles?: string | string[]): AnyFunction {
  if (!roleOrRoles) {
    roleOrRoles = [];
  }

  if (typeof roleOrRoles === 'string') {
    roleOrRoles = [roleOrRoles];
  }

  return (clsOrObject: AnyFunction | object, method?: string) => {
    getMetadataArgsStorage().responseHandlers.push({
      type: 'authorized',
      target: method ? clsOrObject.constructor : (clsOrObject as AnyFunction),
      method,
      value: [roleOrRoles, []]
    });
  };
}
