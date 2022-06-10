export interface AdapterInterface {
  isVerbosed: boolean;

  name(name: string): this;

  description(description: string): this;

  version(version: string): this;

  option(name: string, description?: string, defaultValue?: any): this;

  action(fn: (args: string[], options: any) => any): any;
}
