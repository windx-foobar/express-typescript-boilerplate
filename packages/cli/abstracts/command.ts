import chalk from 'chalk';

import { AdapterInterface } from '../adapters/interface';
import { CommanderAdapter } from '../adapters/commander';

export abstract class Command {
  protected $adapter: AdapterInterface;
  protected $transport: (...args: any[]) => any;

  constructor(adapter?: AdapterInterface, transport?: (...args: any[]) => any) {
    adapter = adapter || new CommanderAdapter();
    adapter.name(this.name);
    adapter.description(this.description);

    transport = transport || console.log;

    this.$adapter = adapter;
    this.$transport = transport;
  }

  public start() {
    this.$adapter.action(this.handle.bind(this));
  }

  protected get name(): string {
    return 'command';
  }

  protected get description(): string {
    return 'description';
  }

  protected get version(): string {
    return '0.0.0';
  }

  protected registerOption(option: string, description?: string, defaultValue?: any): this {
    this.$adapter.option(option, description, defaultValue);
    return this;
  }

  protected log(...args: any[]) {
    if (this.$adapter.isVerbosed) {
      this.$transport(chalk.white.bold.bgYellow('LOG'), '👁', ...args);
    }
  }

  protected externalLog(prefix: string, color: string = 'yellow', ...args: any[]) {
    const bgColor = 'bg' + color[0].toUpperCase() + color.slice(1);
    this.$transport(chalk.white.bold[bgColor](prefix), '👁', ...args);
  }

  protected error(...args: any[]) {
    this.$transport(chalk.white.bold.bgRed('ERROR'), '👎', ...args);
  }

  protected success(...args: any[]) {
    this.$transport(chalk.white.bold.bgGreen('SUCCESS'), '👍', ...args);
  }

  protected async handle(options: any, ...args: string[]): Promise<any> {}
}
