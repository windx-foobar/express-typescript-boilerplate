import { User } from '@/app/models/User';
import { createDatabaseConnection, closeDatabase } from '../../utils/database';

describe('UserValidations', () => {
  let connection;

  beforeAll(async () => {
    connection = await createDatabaseConnection();
  });

  afterAll(async () => {
    await closeDatabase(connection);
  });

  test('User should always have a email', async (done) => {
    const user = new User();
    const errorsOne = await user.classValidate({ toJson: false });
    user.email = 'user1@mail.ru';
    const errorsTwo = await user.classValidate({ toJson: false });
    expect(errorsOne.length).toBeGreaterThan(errorsTwo.length);

    done();
  });

  test('User should always have a password', async (done) => {
    const user = new User();
    const errorsOne = await user.classValidate({ toJson: false });
    user.password = 'secret';
    const errorsTwo = await user.classValidate({ toJson: false });
    expect(errorsOne.length).toBeGreaterThan(errorsTwo.length);

    done();
  });

  test('User validation should succeed with all required fields', async (done) => {
    const user = new User();
    user.email = 'user1@mail.ru';
    user.password = 'secret';
    const errors = await user.classValidate({ toJson: false });
    expect(errors.length).toEqual(0);

    done();
  });
});
