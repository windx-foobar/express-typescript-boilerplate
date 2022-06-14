import { defaultMetadataRegistry } from 'event-dispatch/MetadataRegistry';

interface IocAdapter {
  get(someClass: any): any;
}

export function useContainer(iocAdater: IocAdapter) {
  defaultMetadataRegistry.container = iocAdater;
}
