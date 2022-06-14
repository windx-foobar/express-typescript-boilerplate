import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Container } from 'typedi';

import { Mailer } from '@packages/mailer';
import { MockAdapter } from '@packages/mailer/adapters';

import { LogMock } from '@/test/unit/lib';

export const mailerLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined
) => {
  const adapter = new MockAdapter();
  const logger = new LogMock();
  const mailer = new Mailer(adapter, logger, false);

  Container.set({
    id: 'Mailer',
    value: (): Mailer => mailer
  });

  if (settings) {
    settings.setData('mailer', mailer);
    settings.onShutdown(() => mailer.close());
  }
};
