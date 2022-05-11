import chalk from 'chalk';
import { env } from '../env';
import { exec } from '../utils';
import commander from 'commander';

commander
  .option(
    '--seeds <path>',
    'add filepath for your seeds',
    './database/seeds'
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
  .parse(process.argv);

function makeSeedsNames(): string {
  if (Array.isArray(commander.run)) {
    return commander.run?.map((name: string) => `--seed=${name}`).join(' ');
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

  const { host, port, username, password, type, database } = env.db;

  const connectionString = `${type}://${username}:${password}@${host}:${port}/${database}`;

  try {
    const seedsNames = makeSeedsNames();
    const commandName = makeCommandName(seedsNames, !!commander.revert);

    const { stdout, stderr } = await exec([
      'ts-node --transpileOnly',
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
