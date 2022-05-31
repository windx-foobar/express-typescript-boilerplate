import { QueryInterface, Op } from 'sequelize';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export default {
  async up(queryInterface: QueryInterface) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const records = await Promise.all(
      Array(10).fill('')
        .map(async (): Promise<any> => {
          const password = await bcrypt.hash('secret', 10);
          const created_at = faker.date.between('2022-02-01T00:00:00.000Z', new Date());

          return {
            email: faker.unique(faker.internet.email),
            password,
            created_at,
            updated_at: created_at
          };
        })
    );

    await queryInterface.bulkInsert('users', records);
  },

  async down(queryInterface: QueryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.delete(undefined, 'users', {
      id: { [Op.gt]: 1 }
    });
  }
};
