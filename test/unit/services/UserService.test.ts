import { createDatabaseConnection, closeDatabase, createTables } from '../../utils/database';
import { EventDispatcherMock } from '../lib';

import { User } from '@app/models/User';
import { UserService } from '@app/services/UserService';
import { events } from '@app/http/subscribers/events';

describe('UserService', () => {
  let connection;

  // -------------------------------------------------------------------------
  // Setup up
  // -------------------------------------------------------------------------

  beforeAll(async () => {
    connection = await createDatabaseConnection();
    await createTables(connection);
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

  test('update should be update user', async (done) => {
    const ed = new EventDispatcherMock();

    const user = await User.create({ email: 'user1@mail.ru', password: 'secret' });

    const data = new User();
    data.email = 'user2@mail.ru';
    data.password = 'supersecret';

    const userService = new UserService(ed as any);
    const updatedUser = await userService.update(user, data);

    expect(updatedUser).toBe(user);

    expect(updatedUser.email).toEqual('user2@mail.ru');
    expect(await updatedUser.comparePassword('supersecret')).toBeTruthy();

    expect(user.email).toEqual('user2@mail.ru');
    expect(await user.comparePassword('supersecret')).toBeTruthy();

    done();
  });

  test('create should be dispatch subscribers', async (done) => {
    const ed = new EventDispatcherMock();

    const user = new User();
    user.email = 'user3@mail.ru';
    user.password = 'secret';

    const userService = new UserService(ed as any);
    const newUser = await userService.create(user);

    expect(ed.dispatchMock).toBeCalledWith([events.user.created, newUser]);

    done();
  });
});
