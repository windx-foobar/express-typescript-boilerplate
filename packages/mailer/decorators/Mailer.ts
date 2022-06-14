import { Container } from 'typedi';

export function Mailer(): ParameterDecorator {
  return (object: object, propertyKey: string | symbol, index: number) => {
    const propertyName = propertyKey ? propertyKey.toString() : '';
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: Container.get('Mailer')
    });
  };
}

export { Mailer as MailerInterface } from '../Mailer';
