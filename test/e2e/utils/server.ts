import { createTables } from '../../utils/database';
import { bootstrapApp } from './bootstrap';

export const prepareServer = async (options?: { migrate: boolean }) => {
  const settings = await bootstrapApp();
  if (options && options.migrate) {
    await createTables(settings.connection);
  }
  return settings;
};
