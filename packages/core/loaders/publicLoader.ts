import * as express from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import * as path from 'path';
import favicon from 'serve-favicon';

/**
 * publicLoader
 * ------------------------------
 * Регистрация статики в express
 */
export const publicLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
): void => {
  if (settings) {
    const expressApp = settings.getData('express_app');
    expressApp
      // Serve static filles like images from the public folder
      .use(express.static(path.join(process.cwd(), 'public'), { maxAge: 31557600000 }))

      // A favicon is a visual cue that client software, like browsers, use to identify a site
      .use(favicon(path.join(process.cwd(), 'public', 'favicon.ico')));

  }
};
