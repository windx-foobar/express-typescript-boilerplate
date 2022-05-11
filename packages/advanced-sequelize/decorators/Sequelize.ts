import { Container } from 'typedi';

export function Sequelize(): ParameterDecorator {
  return (object: object, propertyKey: string | symbol, index: number): any => {
    const propertyName = propertyKey ? propertyKey.toString() : '';
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: Container.get('Sequelize')
    });
  };
}

export { Sequelize as SequelizeInterface } from 'sequelize-typescript';
