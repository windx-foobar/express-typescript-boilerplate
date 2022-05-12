import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';

module.exports = {
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
          const created_at = faker.date.between('2022-02-01T00:00:00.000Z', new Date());

          return {
            name: faker.unique(faker.name.firstName),
            age: faker.datatype.number({ min: 1, max: 12 }),
            created_at,
            updated_at: created_at
          };
        })
    );

    await queryInterface.bulkInsert('pets', records);
  },

  async down(queryInterface: QueryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.delete(undefined, 'pets', {});
  }
};
