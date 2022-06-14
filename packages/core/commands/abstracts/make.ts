import path from 'path';
import fs from 'fs';
import Mustache from 'mustache';

import { Command } from '@packages/cli';
import { config } from '@packages/core/config';

export abstract class MakeCommand extends Command {
  protected constructor() {
    super();

    this.$adapter.version(config.app.version);
  }

  protected get name() {
    return 'make.command';
  }

  protected get stubsPath() {
    return path.resolve(__dirname, '..', 'stubs');
  }

  protected get stubExtension() {
    return '.stub';
  }

  protected get outputPath(): string {
    throw new Error('Must be overwritten in the child class');
  }

  protected async render(fileName: string, stubName: string, options?: object) {
    try {
      const stubPath = this.resolveStubs(`${stubName}${this.stubExtension}`);
      const stubContent = await fs.promises.readFile(stubPath);
      const template = Mustache.render(stubContent.toString(), options);

      this.log('Запись файла в папку');
      await fs.promises.writeFile(
        this.outputPath + '/' + fileName,
        template
      );
      this.log('Запись успешно завершена');
    } catch (error) {
      throw error;
    }
  }

  private resolveStubs(...paths: string[]) {
    return path.resolve(this.stubsPath, ...paths);
  }
}
