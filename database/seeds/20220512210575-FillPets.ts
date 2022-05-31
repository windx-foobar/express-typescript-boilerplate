import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';

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
        .map(async (_, idx): Promise<any> => {
          let name: string;
          let age: number;

          if (idx === 0) {
            name = 'Roxy';
            age = 6;
          } else {
            name = faker.unique(faker.name.firstName);
            age = faker.datatype.number({ min: 1, max: 12 });
          }

          const created_at = faker.date.between('2022-02-01T00:00:00.000Z', new Date());

          return {
            name,
            age,
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
