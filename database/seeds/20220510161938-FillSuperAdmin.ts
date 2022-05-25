import { QueryInterface } from 'sequelize';
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

    const password = await bcrypt.hash('123456', 10);

    await queryInterface.insert(undefined, 'users', {
      email: 'admin@site.com',
      password,
      created_at: new Date(),
      updated_at: new Date()
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
