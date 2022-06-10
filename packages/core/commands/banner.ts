import chalk from 'chalk';
import * as figlet from 'figlet';

import { Command } from '@packages/cli';

export class BannerCommand extends Command {
  protected async handle(options: any, ...args): Promise<void> {
    figlet.text(args[0], (error: any, data: any) => {
      if (error) {
        return this.externalLog('Figlet', 'red', error);
      }

      return this.success(data);
    });
  }

  protected success(...args) {
    this.$transport(chalk.blue(args[0]));
    this.$transport('');
  }
}

new BannerCommand().start();
