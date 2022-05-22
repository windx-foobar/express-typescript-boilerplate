import { getMetadataArgsStorage } from 'routing-controllers';
import { AnyFunction } from '../utils';

type OneOrMany = string | string[];

export function Can(permissionOrPermissions: OneOrMany = [], roleOrRoles: OneOrMany = []) {
  if (typeof permissionOrPermissions === 'string') {
    permissionOrPermissions = [permissionOrPermissions];
  }

  if (typeof roleOrRoles === 'string') {
    roleOrRoles = [roleOrRoles];
  }

  return (clsOrObject: AnyFunction | object, method?: string) => {
    getMetadataArgsStorage().responseHandlers.push({
      type: 'authorized',
      target: method ? clsOrObject.constructor : (clsOrObject as AnyFunction),
      method,
      value: [roleOrRoles, permissionOrPermissions]
    });
  };
}
