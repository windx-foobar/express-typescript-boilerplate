import { Sequelize } from 'sequelize-typescript';

import { Pet } from '@app/models/Pet';
import { User } from '@app/models/User';
import { closeDatabase, createDatabaseConnection, createTables } from '../utils/database';
import { configureLogger } from '../utils/logger';

describe('PetModel', () => {

  // -------------------------------------------------------------------------
  // Setup up
  // -------------------------------------------------------------------------

  let connection: Sequelize;
  let user: User;

  beforeAll(async () => {
    configureLogger();
    connection = await createDatabaseConnection();
    await createTables(connection);
  });

  // -------------------------------------------------------------------------
  // Tear down
  // -------------------------------------------------------------------------

  afterAll(() => closeDatabase(connection));

  // -------------------------------------------------------------------------
  // Test cases
  // -------------------------------------------------------------------------

  test('should create a new user in the database', async (done) => {
    const userModel = new User();
    userModel.email = 'user1@mail.ru';
    userModel.password = 'secret';

    let userRow = await userModel.save();
    expect(userRow.id).toBe(1);
    expect(userRow.email).toBe(userModel.email);

    userRow = await User.findByPk(1);
    if (userRow) {
      expect(userRow.id).toBe(1);
      expect(userRow.email).toBe(userModel.email);
    }

    user = userRow;
    done();
  });

  test('should skip hash password when user create', async (done) => {
    const userModel = new User();
    userModel.email = 'user2@mail.ru';
    userModel.password = 'hashedPassword';
    userModel.hashedPassword = 'secret';

    const userRow = await userModel.save();
    expect(userRow.password).toBe('secret');

    done();
  });

  test('should hash password when user create', async (done) => {
    const userModel = new User();
    userModel.email = 'user3@mail.ru';
    userModel.password = 'secret';

    const userRow = await userModel.save();
    expect(userRow.password).not.toBe('secret');

    const isCompared = await userRow.comparePassword('secret');
    expect(isCompared).toBe(true);

    done();
  });

  test('should create a new pet in the database and cast to user', async (done) => {
    const pet = new Pet();
    pet.name = 'Roxy';
    pet.age = 1;

    let petRow = await pet.save();
    expect(petRow.id).toBe(1);
    expect(petRow.name).toBe(pet.name);
    expect(petRow.age).toBe(pet.age);

    petRow = await Pet.findByPk(1);
    if (petRow) {
      expect(petRow.id).toBe(1);
      expect(petRow.name).toBe(pet.name);
      expect(petRow.age).toBe(pet.age);

      await petRow.$set('user', user);

      const petUser = await petRow.$get('user');
      expect(petRow.userId).toBe(user.id);
      expect(petUser).toEqual(user);
    } else {
      fail('Could not find pet');
    }
    done();
  });
});
