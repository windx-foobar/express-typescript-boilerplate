import { QueryInterface } from 'sequelize';

export default {
  async up({ sequelize }: QueryInterface) {
    /**
     * Put migration code here
     * @see https://sequelize.org/docs/v6/other-topics/migrations/#migration-skeleton
     */

    return sequelize.query(`
      START TRANSACTION;

      CREATE TABLE IF NOT EXISTS "pets" (
        "id" SERIAL,
        "name" VARCHAR(255) NOT NULL,
        "age" INTEGER NOT NULL,
        "payload" JSONB NOT NULL DEFAULT '{}',

        "user_id" INTEGER REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,

        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "deleted_at" TIMESTAMP WITH TIME ZONE,

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

      DROP TABLE IF EXISTS "pets";

      COMMIT;
    `);
  }
};
