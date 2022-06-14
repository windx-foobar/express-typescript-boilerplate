import { EventDispatcher as EventDispatcherClass } from '@packages/event-dispatch';
import { Container } from 'typedi';

export function EventDispatcher(): any {
  return (object: any, propertyName: string, index?: number): any => {
    const eventDispatcher = new EventDispatcherClass();
    Container.registerHandler({ object, propertyName, index, value: () => eventDispatcher });
  };
}

export { EventDispatcher as EventDispatcherInterface } from '@packages/event-dispatch';
