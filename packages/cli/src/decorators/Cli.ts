import { Container } from 'typedi';

export function Cli(): ParameterDecorator {
  return (object: object, propertyKey: string | symbol, index: number): any => {
    const propertyName = propertyKey ? propertyKey.toString() : '';
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: Container.get('Cli')
    });
  };
}

export { Cli as CliInterface } from '../Cli';
