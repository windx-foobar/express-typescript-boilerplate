import chalk from 'chalk';
import path from 'path';
import { exec, glob } from '../utils';
import commander from 'commander';
import { config } from '../config';

commander
  .option(
    '--seeds <path>',
    'add filepath for your seeds',
    path.resolve(config.app.dirs.migrationsDir, '../seeds')
  )
  .option(
    '--run <seeds>',
    'run specific seeds (file names without extension)',
    (val: string[] | any) => val.split(','),
    ''
  )
  .option(
    '--revert',
    'run revert seeds'
  )
  .option(
    '--last',
    'run only last seed'
  )
  .parse(process.argv);

async function makeSeedsNames(): Promise<string> {
  let seeds: any[];

  if (!commander.run) {
    seeds = await glob(path.resolve(config.app.dirs.migrationsDir, '../seeds/*.ts'));
    seeds = seeds.map((seed) => seed.split('/').slice(-1).join(''));

    if (commander.last) {
      seeds = seeds.slice(-1);
    }
  } else {
    seeds = commander?.run ?? [];
  }

  if (Array.isArray(seeds)) {
    return seeds.map((name: string) => `--seed=${name}`).join(' ');
  }

  return '';
}

function makeCommandName(
  names: string,
  revert: boolean
): 'db:seed' | 'db:seed:all' | 'db:seed:undo' | 'db:seed:undo:all' {
  const all = !names.length;

  if (all) {
    if (revert) return 'db:seed:undo:all';

    return 'db:seed:all';
  } else {
    if (revert) return 'db:seed:undo';

    return 'db:seed';
  }
}

async function run() {
  const log = console.log;

  const { host, port, username, password, type, database } = config.db;

  const connectionString = `${type}://${username}:${password}@${host}:${port}/${database}`;

  try {
    if (commander.run && commander.last) {
      log('\n👎 Error!\n', chalk.red('Опции --run и --last не могут быть переданы вместе\n\n'));
      return process.exit(1);
    }

    const seedsNames = await makeSeedsNames();
    const commandName = makeCommandName(seedsNames, !!commander.revert);

    const { stdout, stderr } = await exec([
      'ts-node -T',
      './node_modules/sequelize-cli/lib/sequelize',
      commandName,
      `--seeders-path=${commander.seeds}`,
      `--url=${connectionString}`,
      seedsNames
    ].join(' '));

    if (stderr) throw new Error(stderr);

    log('\n👍 Success!', chalk.gray.underline(stdout));

    return process.exit(0);
  } catch (error) {
    throw error;
  }
}

run();
