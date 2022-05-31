import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    /**
     * Put seed code here
     * @see https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-seed
     */

    const transaction = await queryInterface.sequelize.transaction();

    try {
      const PERMISSIONS: Array<[string, string]> = [
        ['pets', 'Питомцы'],
        ['users', 'Пользователи']
      ];

      const ROLES: any[] = [
        {
          name: 'super_admin',
          description: 'Права супер админа'
        },
        {
          name: 'user',
          description: 'Права обычного пользователя'
        },
        {
          name: 'guest',
          description: 'Права гостя'
        }
      ];

      const ROLES_PERMISSIONS = [
        {
          roleName: 'super_admin',
          permissionNames: PERMISSIONS.map(([name]) => `${name}.write`)
        },
        {
          roleName: 'user',
          permissionNames: ['pets.self-write', 'users.read']
        },
        {
          roleName: 'guest',
          permissionNames: ['pets.read']
        }
      ];

      await queryInterface.bulkInsert(
        'permissions',
        PERMISSIONS.reduce((acc: any[], [name, description]) => {
          const rows = [
            { name: `${name}.read`, description: `${description}: чтение` },
            { name: `${name}.write`, description: `${description}: запись` }
          ];

          if (!['users'].includes(name)) {
            rows.push(
              { name: `${name}.self-read`, description: `${description}: ассоциативное чтение` },
              { name: `${name}.self-write`, description: `${description}: ассоциативная запись` }
            );
          }

          rows.forEach((row) => {
            acc.push({
              ...row,
              created_at: new Date(),
              updated_at: new Date()
            });
          });

          return acc;
        }, []),
        {
          transaction
        }
      );

      await queryInterface.bulkInsert(
        'roles',
        ROLES.map((row) => ({
          ...row,
          created_at: new Date(),
          updated_at: new Date()
        })),
        {
          transaction
        }
      );

      await Promise.all(
        ROLES_PERMISSIONS.map(async ({ roleName, permissionNames }) => {
          const permissionsString = permissionNames
            .map((name) => `'${name}'`)
            .join(',');

          const [permissions] = await queryInterface.sequelize.query(
            `SELECT id, name
             FROM permissions
             WHERE name IN (${permissionsString})`,
            { transaction }
          ) as any;

          const [[role]] = await queryInterface.sequelize.query(
            `SELECT id, name
             FROM roles
             WHERE name = '${roleName}'`,
            { transaction }
          ) as any;

          const data = permissions.map(({ id }) => {
            return {
              role_id: role.id,
              permission_id: id,
              created_at: new Date()
            };
          });

          await queryInterface.bulkInsert('roles_permissions', data, { transaction });
        })
      );

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
