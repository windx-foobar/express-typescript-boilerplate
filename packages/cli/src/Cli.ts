import { CommanderStatic } from 'commander';
import chalk from 'chalk';
import path from 'path';

import { config } from '@packages/core/config';
import { glob } from '@packages/core/utils';

import { ERROR_PREFIX } from './lib/ui';
import { AbstractCommand } from './lib/abstracts';
import { CommandContainer } from './CommandContainer';

export class Cli {
  constructor(
    private program: CommanderStatic
  ) {
  }

  public async load(): Promise<this> {
    try {
      await this.registerCommands();
      this.handleInvalidCommand();

      return this;
    } catch (error) {
      throw error;
    }
  }

  private async registerCommands() {
    try {
      const appCommands = [];

      const coreCommands = await glob(path.resolve(__dirname, 'commands/*Command.ts'));

      await Promise.all(
        config.app.dirs.commands.map(async (filesPath) => {
          const files = await glob(path.resolve(process.cwd(), filesPath));
          appCommands.push(...files);
        })
      );

      coreCommands.map((commandPath) => {
        const command: AbstractCommand = CommandContainer.get(require(commandPath).default);
        command.load(this.program);
      });
    } catch (error) {
      throw error;
    }
  }

  private handleInvalidCommand() {
    this.program.on('command:*', () => {
      console.error(
        `\n${ERROR_PREFIX} Недоступная команда: ${chalk.red('%s')}`,
        this.program.args.join(' ')
      );
      console.log(
        `Наберите ${chalk.red('--help')}, чтобы увидеть список доступных комманд.\n`
      );
      process.exit(1);
    });
  }
}
