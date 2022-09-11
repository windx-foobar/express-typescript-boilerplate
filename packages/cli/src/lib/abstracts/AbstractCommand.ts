import { CommanderStatic } from 'commander';

import { CommandOptions } from '../../types';

export abstract class AbstractCommand implements CommandOptions {
  public name = '';
  public description = '';
  public alias = '';
  public namespace = '';
  public arguments = [];
  public options = [];

  public load(program: CommanderStatic) {
    const ctxProgram = program.command(
      `${this.namespace}:${this.name} ${this.arguments.join(' ')}`
    );
    if (this.description) ctxProgram.description(this.description);
    if (this.alias) ctxProgram.alias(this.alias);

    this.options.forEach((option) => {
      const [directive, description, defaultValue] = option;
      ctxProgram.option(directive, description, defaultValue);
    });

    ctxProgram.action(this.handle.bind(this));
  }

  public abstract handle(...args: any[]): Promise<any>;

  // TODO: Адаптировать методы логгирования (предположительно используя https://github.com/unjs/consola)

  // protected log(...args: any[]) {
  //   if (this.$adapter.isVerbosed) {
  //     this.$transport(chalk.white.bold.bgYellow('LOG'), '👁', ...args);
  //   }
  // }
  //
  // protected externalLog(prefix: string, color: string = 'yellow', ...args: any[]) {
  //   const bgColor = 'bg' + color[0].toUpperCase() + color.slice(1);
  //   this.$transport(chalk.white.bold[bgColor](prefix), '👁', ...args);
  // }
  //
  // protected error(...args: any[]) {
  //   this.$transport(chalk.white.bold.bgRed('ERROR'), '👎', ...args);
  // }
  //
  // protected success(...args: any[]) {
  //   this.$transport(chalk.white.bold.bgGreen('SUCCESS'), '👍', ...args);
  // }
}
