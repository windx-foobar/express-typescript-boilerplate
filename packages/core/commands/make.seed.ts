import fs from 'fs';
import path from 'path';
import moment from 'moment';
import chalk from 'chalk';
import { env } from '../env';
import commander from 'commander';

commander
  .option(
    '--name <name>',
    'seed name'
  )
  .option(
    '--seeders-path <path>',
    'seeders path',
    path.resolve(env.app.dirs.migrationsDir, '../seeds')
  )
  .parse(process.argv);

const absoluteStubsPath = path.resolve(__dirname, './stubs');
const resolveStubs = (...dirs: string[]) => path.resolve(absoluteStubsPath, ...dirs);
const resolveSeeders = (...dirs: string[]) => path.resolve(commander.seedersPath, ...dirs);

async function run() {
  const log = console.log;

  try {
    const seedName = `${moment().format('YYYYMMDDHHMMSS')}-${commander.name}.ts`;
    const stubContent = await fs.promises.readFile(resolveStubs('seed.stub'));
    const seedPath = resolveSeeders(seedName);

    await fs.promises.writeFile(
      seedPath,
      stubContent.toString('utf-8')
    );

    const successMessage = `
      Seed created in ${seedPath}
    `;

    log('\n👍 Success!', chalk.gray.underline('\n' + successMessage.trim()));

    return process.exit(0);
  } catch (error) {
    throw error;
  }
}

run();
