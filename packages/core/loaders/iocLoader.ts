import { useContainer as classValidatorUseContainer } from 'class-validator';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Container } from 'typedi';

/**
 * iocLoader
 * ------------------------------
 * Регистрация контейнера в местах, где он нужен
 */
export const iocLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
): void => {

  /**
   * Setup routing-controllers to use typedi container.
   */
  routingUseContainer(Container);
  classValidatorUseContainer(Container);
};
