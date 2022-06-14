import '../lib/setup';

import { Container } from 'typedi';

import { Mailer } from '@packages/mailer';
import { MockAdapter } from '@packages/mailer/adapters';

import { User } from '@app/models/User';
import { UserService } from '@app/services/UserService';

import { createDatabaseConnection, closeDatabase, createTables } from '../../utils/database';
import { renderFile } from '../../utils/mailer';
import { EventDispatcherMock, LogMock } from '../lib';

let mailer: Mailer;
let mailerAdapter: MockAdapter;

describe('AuthService', () => {
  let connection;

  // -------------------------------------------------------------------------
  // Setup up
  // -------------------------------------------------------------------------

  beforeAll(async () => {
    connection = await createDatabaseConnection();
    await createTables(connection);

    const loggerMock = new LogMock();
    mailerAdapter = new MockAdapter();
    mailer = new Mailer(mailerAdapter, loggerMock, true);

    Container.set({
      id: 'Mailer',
      value: (): Mailer => mailer
    });
  });

  // -------------------------------------------------------------------------
  // Tear down
  // -------------------------------------------------------------------------

  afterAll(async () => {
    await closeDatabase(connection);
  });

  // -------------------------------------------------------------------------
  // Test cases
  // -------------------------------------------------------------------------

  test('create should be send mail', async (done) => {
    const eventDispatcherMock = new EventDispatcherMock();

    const userService = new UserService(eventDispatcherMock as any);

    const authServiceClass = require('@app/services/AuthService').AuthService;
    const authService = new authServiceClass(userService, mailer);

    const user = await User.create({ email: 'user1@mail.ru', password: 'secret' });

    await authService.create(user);

    const fileContent = await renderFile(undefined, {
      name: user.email
    });
    expect(mailerAdapter.sendFromHtmlMock).toBeCalledWith(
      'Завершение регистрации',
      fileContent,
      user.email
    );

    done();
  });
});
