import { EventDispatcher as BaseDispatcher } from 'event-dispatch/EventDispatcher';
import { defaultMetadataRegistry } from 'event-dispatch/MetadataRegistry';

export class EventDispatcher extends BaseDispatcher {
  public dispatchAsync(eventNameOrNames: string | string[], data?: any): Promise<any> {
    let eventNames: string[] = [];
    if (eventNameOrNames instanceof Array) {
      eventNames = eventNameOrNames as string[];
    } else if (typeof eventNameOrNames === 'string') {
      eventNames = [eventNameOrNames];
    }

    return Promise.all(
      eventNames.map(async (eventName) => {
        await Promise.all(
          defaultMetadataRegistry
            .collectEventsHandlers
            .filter(handler => handler.hasOwnProperty(eventName))
            .map(async (handler: any) => {
              const result = handler[eventName](data);

              if (result instanceof Promise) {
                return await result;
              } else {
                return result;
              }
            })
        );
      })
    );
  }
}
