import fs from 'fs';
import path from 'path';
import moment from 'moment';
import chalk from 'chalk';
import commander from 'commander';
import { config } from '../config';

commander
  .option(
    '--name <name>',
    'migration name'
  )
  .option(
    '--migrations-path <path>',
    'migrations path',
    config.app.dirs.migrationsDir
  )
  .parse(process.argv);

const absoluteStubsPath = path.resolve(__dirname, './stubs');
const resolveStubs = (...dirs: string[]) => path.resolve(absoluteStubsPath, ...dirs);
const resolveMigrations = (...dirs: string[]) => path.resolve(commander.migrationsPath, ...dirs);

async function run() {
  const log = console.log;

  try {
    const migrationName = `${moment().format('YYYYMMDDHHMMSS')}-${commander.name}.ts`;
    const stubContent = await fs.promises.readFile(resolveStubs('migration.stub'));
    const migrationPath = resolveMigrations(migrationName);

    await fs.promises.writeFile(
      migrationPath,
      stubContent.toString('utf-8')
    );

    const successMessage = `
      Migration created in ${migrationPath}
    `;

    log('\n👍 Success!', chalk.gray.underline('\n' + successMessage.trim()));

    return process.exit(0);
  } catch (error) {
    throw error;
  }
}

run();
