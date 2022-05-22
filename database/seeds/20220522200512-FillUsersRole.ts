import { fn, QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    /**
     * Put seed code here
     * @see https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-seed
     */

    const transaction = await queryInterface.sequelize.transaction();

    try {
      const [users] = await queryInterface.sequelize.query(
        `SELECT id, email
         FROM users
         WHERE email <> 'admin@site.com'`,
        { transaction }
      ) as any;

      const [[role]] = await queryInterface.sequelize.query(
        `SELECT id, name
         FROM roles
         WHERE name = 'user'`,
        { transaction }
      ) as any;

      const data = users.map((user) => {
        return {
          user_id: user.id,
          role_id: role.id,
          created_at: fn('now')
        };
      });

      await queryInterface.bulkInsert('users_roles', data, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface) {
    /**
     * Put revert seed code here
     * @see https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-seed
     */

    return true;
  }
};
