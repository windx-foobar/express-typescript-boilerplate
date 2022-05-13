import path from 'path';
import fs from 'fs';
import { Sequelize, SequelizeOptions, DataType } from 'sequelize-typescript';
import { fn } from 'sequelize';
import bcrypt from 'bcrypt';
import { config } from '@/packages/core/config';

export const createDatabaseConnection = async (): Promise<Sequelize> => {
  const options: SequelizeOptions = {
    dialect: config.db.type as any,
    storage: config.db.database,
    pool: {
      min: 0,
      max: 10,
      idle: 10000
    },
    logging: false,
    models: [config.app.dirs.entitiesDir]
  };

  const connection = new Sequelize(options);
  return connection;
};

export const createTables = async (connection: Sequelize) => {
  const queryInterface = await connection.getQueryInterface();

  await queryInterface.createTable('users', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
      unique: true
    },
    password: DataType.STRING,
    payload: {
      type: DataType.JSON,
      defaultValue: '{}'
    },
    created_at: {
      type: DataType.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataType.DATE,
      allowNull: false
    },
    deleted_at: DataType.DATE
  });

  await queryInterface.createTable('pets', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataType.STRING,
      allowNull: false
    },
    age: {
      type: DataType.INTEGER,
      allowNull: false
    },
    payload: {
      type: DataType.JSON,
      defaultValue: '{}'
    },
    created_at: {
      type: DataType.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataType.DATE,
      allowNull: false
    },
    deleted_at: DataType.DATE,
    user_id: {
      type: DataType.INTEGER,
      references: {
        model: {
          tableName: 'users'
        },
        key: 'id'
      }
    }
  });
};

export const createSuperAdmin = async (connection: Sequelize) => {
  const queryInterface = await connection.getQueryInterface();

  const password = await bcrypt.hash('secret', 10);
  await queryInterface.insert(undefined, 'users', {
    email: 'admin@site.com',
    password,
    created_at: fn('datetime'),
    updated_at: fn('datetime')
  });
};

export const synchronizeDatabase = async (connection: Sequelize) => {
  await connection.getQueryInterface().dropDatabase(config.db.database);
  return await connection.sync();
};

export const closeDatabase = async (connection: Sequelize) => {
  await fs.promises.unlink(path.resolve(process.cwd(), config.db.database));
  return await connection.close();
};
