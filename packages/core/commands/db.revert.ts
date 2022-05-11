import chalk from 'chalk';
import { env } from '../env';
import { exec } from '../utils';

async function run() {
  const log = console.log;

  const { host, port, username, password, type, database } = env.db;

  const connectionString = `${type}://${username}:${password}@${host}:${port}/${database}`;

  try {
    const { stdout, stderr } = await exec([
      'ts-node --transpileOnly',
      './node_modules/sequelize-cli/lib/sequelize',
      'db:migrate:undo:all',
      `--migrations-path=${env.app.dirs.migrationsDir}`,
      `--url=${connectionString}`
    ].join(' '));

    if (stderr) throw new Error(stderr);

    log('\n👍 Success!', chalk.gray.underline(stdout));

    return process.exit(0);
  } catch (error) {
    throw error;
  }
}

run();
