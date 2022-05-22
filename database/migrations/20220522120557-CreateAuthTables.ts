import { QueryInterface } from 'sequelize';

export default {
  async up({ sequelize }: QueryInterface) {
    /**
     * Put migration code here
     * @see https://sequelize.org/docs/v6/other-topics/migrations/#migration-skeleton
     */

    return sequelize.query(`
      START TRANSACTION;

      CREATE TABLE IF NOT EXISTS "roles" (
        "id" SERIAL,
        "name" VARCHAR(255) NOT NULL UNIQUE,
        "description" VARCHAR(255) DEFAULT NULL,

        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "deleted_at" TIMESTAMP WITH TIME ZONE,

        PRIMARY KEY ("id")
      );

      CREATE TABLE IF NOT EXISTS "permissions" (
        "id" SERIAL,
        "name" VARCHAR(255) NOT NULL UNIQUE,
        "description" VARCHAR(255) DEFAULT NULL,

        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "deleted_at" TIMESTAMP WITH TIME ZONE,

        PRIMARY KEY ("id")
      );

      CREATE TABLE IF NOT EXISTS "roles_permissions" (
        "id" SERIAL,

        "role_id" INTEGER REFERENCES "roles" ("id")
          ON DELETE SET NULL ON UPDATE CASCADE,
        "permission_id" INTEGER REFERENCES "permissions" ("id")
          ON DELETE SET NULL ON UPDATE CASCADE,

        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,

        PRIMARY KEY ("id")
      );

      CREATE TABLE IF NOT EXISTS "users_roles" (
        "id" SERIAL,

        "role_id" INTEGER REFERENCES "roles" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
        "user_id" INTEGER REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,

        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,

        PRIMARY KEY ("id")
      );

      COMMIT;
    `);
  },

  async down({ sequelize }: QueryInterface) {
    /**
     * Put migration rollback code here
     * @see https://sequelize.org/docs/v6/other-topics/migrations/#migration-skeleton
     */

    return sequelize.query(`
      START TRANSACTION;

      DROP TABLE IF EXISTS "users_roles";
      DROP TABLE IF EXISTS "roles_permissions";
      DROP TABLE IF EXISTS "permissions";
      DROP TABLE IF EXISTS "roles";

      COMMIT;
    `);
  }
};
