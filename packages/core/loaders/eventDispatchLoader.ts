import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

import { config } from '@packages/core/config';
import { glob } from '@packages/core/utils';

/**
 * eventDispatchLoader
 * ------------------------------
 * This loads all the created subscribers into the project, so we do not have to
 * import them manually
 */
export const eventDispatchLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined
) => {
  if (settings) {
    const patterns = config.app.dirs.subscribers;

    await Promise.all(
      patterns.map(async (pattern) => {
        const files = await glob(pattern);

        for (const file of files) {
          require(file);
        }
      })
    );
  }
};
