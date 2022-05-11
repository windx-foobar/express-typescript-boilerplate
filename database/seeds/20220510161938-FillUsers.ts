import { QueryInterface, fn } from 'sequelize';
// import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

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

    /*const records = await Promise.all(
     Array(10).fill('')
     .map(async (): Promise<any> => {
     const password = await bcrypt.hash('secret', 10);

     return {
     email: faker.unique(faker.internet.email),
     password,
     createdAt: faker.date.betweens(
     '2022-02-01T00:00:00.000Z',
     new Date()
     )
     };
     })
     );*/
    const password = await bcrypt.hash('123456', 10);

    await queryInterface.insert(undefined, 'users', {
      email: 'admin@site.com',
      password,
      created_at: fn('now'),
      updated_at: fn('now')
    });
  },

  async down(queryInterface: QueryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.delete(undefined, 'users', {
      email: 'admin@site.com'
    });
  }
};
