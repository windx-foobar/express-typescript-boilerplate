import { Command } from 'commander';
import { AdapterInterface } from './interface';

// tslint:disable-next-line:max-classes-per-file
export class CommanderAdapter implements AdapterInterface {
  public isVerbosed = false;
  private readonly program: Command;

  constructor() {
    this.program = new Command();
  }

  public async action(fn) {
    this.program.usage('[options] <argumnets ...>');
    this.program.option('--verbose', 'Полное логгирование команды');
    this.program.parse(process.argv);

    this.isVerbosed = this.program.verbose;
    await fn(this.program, ...this.program.args);
  }

  public description(description: string): this {
    this.program.description(description);
    return this;
  }

  public name(name: string): this {
    this.program.name(name);
    return this;
  }

  public option(name: string, description?: string, defaultValue?: any): this {
    this.program.option(name, description, defaultValue);
    return this;
  }

  public version(version: string): this {
    this.program.version(version, '-V, --version');
    return this;
  }
}
