import { User } from '@/app/models/User';
import { createDatabaseConnection, closeDatabase, createTables } from '../utils/database';

describe('UserModel', () => {
  let connection;

  beforeAll(async () => {
    connection = await createDatabaseConnection();
    await createTables(connection);
  });

  afterAll(async () => {
    await closeDatabase(connection);
  });

  test('User should compare password any scope', async (done) => {
    const initialUser = await User.create({ email: 'user1@mail.ru', password: 'secret' });

    let user = await User.unscoped().findByPk(initialUser.id);
    let compareResult = await user.comparePassword('secret');
    expect(compareResult).toBe(true);

    user = await User.findByPk(initialUser.id);
    compareResult = await user.comparePassword('secret');
    expect(compareResult).toBe(true);

    done();
  });
});
