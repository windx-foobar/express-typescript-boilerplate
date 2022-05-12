import { QueryInterface } from 'sequelize';

export default {
  async up({ sequelize }: QueryInterface) {
    return sequelize.query(`
      START TRANSACTION;

      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL,
        "email" VARCHAR(255) UNIQUE,
        "password" VARCHAR(255) DEFAULT NULL,
        "payload" JSONB NOT NULL DEFAULT '{}',

        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "deleted_at" TIMESTAMP WITH TIME ZONE,

        PRIMARY KEY ("id")
      );

      COMMIT;
    `);
  },

  async down({ sequelize }: QueryInterface) {
    return sequelize.query(`
      START TRANSACTION;

      DROP TABLE IF EXISTS "users";

      COMMIT;
    `);
  }
};
