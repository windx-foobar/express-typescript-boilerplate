import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { Container } from 'typedi';
import commander from 'commander';

import { Cli } from './Cli';

/**
 * cliLoader
 * ------------------------------
 * Загрузчик движка CLI для приложения
 */
export const cliLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined
): Promise<void> => {
  const program: commander.CommanderStatic = commander;

  program
    .name('./bin/wxconsole.ts')
    .version(
      require('../package.json').version,
      '-v, --version',
      'Версия приложения.'
    )
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Информация об использовании.');

  const cli = new Cli(program);
  await cli.load();

  commander.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }

  Container.set({
    id: 'Cli',
    value: (): Cli => cli
  });
  // Container.set('cli', cli);
};
