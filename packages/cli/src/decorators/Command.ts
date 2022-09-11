import { ServiceMetadata, Container } from 'typedi';

import { CommandContainer } from '../CommandContainer';
import { CommandOptions } from '../types';

type Constructable<T> = new (...args: any[]) => T;

/**
 * Marks class as a service that can be injected using container.
 */
export function Command<T>(options: CommandOptions): any {
  const {
    name,
    description,
    arguments: commandArguments = [],
    alias,
    options: commandOptions = [],
    namespace
  } = options;

  return (target: Constructable<T>) => {
    const singletone: any = Container.get(target);

    singletone.name = name;
    singletone.description = description || singletone.description;
    singletone.arguments = [...singletone.arguments, ...commandArguments];
    singletone.alias = alias || singletone.alias;
    singletone.options = [...singletone.options, ...commandOptions];
    singletone.namespace = namespace || singletone.namespace;

    const service: ServiceMetadata<T, undefined> = {
      id: target,
      type: target,
      value: singletone
    };

    CommandContainer.set(service);
  };
}
