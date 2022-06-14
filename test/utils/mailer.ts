import Mustache from 'mustache';
import fs from 'fs';
import path from 'path';

import { config } from '@packages/core/config';

export const renderFile = async (templateName = 'confirm_registration.tpl', data: any) => {
  const templatePath = path.resolve(config.app.dirs.views.mailer, templateName);

  try {
    const templateContent = await fs.promises.readFile(templatePath);
    return Mustache.render(templateContent.toString(), data);
  } catch (error) {
    throw error;
  }
};
